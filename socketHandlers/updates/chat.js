//const Conversation = require("../../models/conversation");
const ConversationSQL = require("../../models/models").Conversation;

const  UserSQL  = require("../../models/models").User;
const serverStore = require("../../serverStore");

const updateChatHistory = async (
  conversationId,
  toSpecifiedSocketId = null
) => {
//ConversationSQL

/*
  const conversation = await Conversation.findById(conversationId).populate({
    path: "messages",
    model: "Message",
    populate: {
      path: "author",
      model: "User",
      select: "username _id",
    },
  });
  */


  const conversationNew = await ConversationSQL.findOne({

    where:{
      _id: conversationId
    }
    /*,
    include: [{
      model: User,
      as: 'participants',
    },
    {
      model: Message,
      as: 'messages',
      include: [{
        model: User,
        as: 'author',
      }]
    }
  ] */
  });

  /*
// Get all messages for the conversation
const messages = await conversationNew.messages.findAll({
  include: [
    {
      model: User,
      as: 'author',
      attributes: ['username', '_id','mail'],
    },
  ],
});
const participants = await conversationNew.participants.findAll({
  include: [
    {
      model: User,
      as: 'author',
      attributes: ['username', '_id','mail'],
    },
  ],
});

*/




const participants = await conversationNew.getUsers(); // Array of promises for User objects.
const populatedParticipants = await Promise.all(participants.map((participant) => participant.reload())); // Array of fully populated User objects.

const messages = await conversationNew.getMessages(); // Array of promises for Message objects.

const populatedMessages = await Promise.all(messages.map((message) => message.reload())); // Array of fully populated Message objects, including author data.
//await Promise.all(messages.map(async (message) => message.messageAuthor=await UserSQL.findByPk(message.author) )); // Array of fully populated Message objects, including author data.


let tempMessages= [];
for(eachMessage of populatedMessages)
{

  //populating message
let authorUser=await UserSQL.findByPk(eachMessage.author) ; // Array of fully populated Message objects, including author data.
let messageAuthor={_id:authorUser._id,username:authorUser.username, mail:authorUser.mail}
tempMessages.push({eachMessage, messageAuthor}) ; //

//console.log(eachMesag)
}


conversationNew.populatedMessages= tempMessages;
conversationNew.populatedParticipants= populatedParticipants;

console.log("populated messages:"+conversationNew.populatedMessages);
console.log("populated participants:"+conversationNew.populatedParticipants);


  if (conversationNew) {
    const io = serverStore.getSocketServerInstance();

    if (toSpecifiedSocketId) {
      // initial update of chat history
    //  return io.to(toSpecifiedSocketId).emit("direct-chat-history", {
     //   messages: conversation.messages,
      //  participants: conversation.participants,
     // });
     if(conversationNew.populatedMessages && conversationNew.populatedMessages.length>0)
     {
      console.log("mesage is: " + JSON.stringify(conversationNew.populatedMessages[0].messageAuthor))
     }
      return io.to(toSpecifiedSocketId).emit("direct-chat-history", {
        messages: conversationNew.populatedMessages,
        participants: conversationNew.populatedParticipants,
      });


    }

    // check if users of this conversation are online
    // if yes emit to them update of messages
/*
    conversation.participants.forEach((userId) => {
      const activeConnections = serverStore.getActiveConnections(
        userId.toString()
      );

      
      activeConnections.forEach((socketId) => {
        io.to(socketId).emit("direct-chat-history", {
          messages: conversation.messages,
          participants: conversation.participants,
        });
      });
    });
    */


    conversationNew.populatedParticipants.forEach(async (participant) => {
      const activeConnections =await  serverStore.getActiveConnections(
        participant._id.toString()
      );

      console.log("participant username:"+participant.username);
      activeConnections.forEach((socketId) => {
        io.to(socketId).emit("direct-chat-history", {
          messages: conversationNew.populatedMessages,
          participants: conversationNew.populatedParticipants,
        });
      });
    });





  }
};

module.exports = { updateChatHistory };
