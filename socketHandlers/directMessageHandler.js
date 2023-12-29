
const MessageSQL = require("../models/models").Message;
const ConversationSQL = require("../models/models").Conversation;
const UserSQL = require("../models/models").User;
const { Op } = require("sequelize");
const chatUpdates = require("./updates/chat");
const ConversationParticipantsSQL = require("../models/models").ConversationParticipants
const ConversationMessagesSQL = require("../models/models").ConversationMessages

const directMessageHandler = async (socket, data) => {
  try {
    console.log("direct message event is being handled");

    const { userId } = socket.user;
    const { receiverUserId, content ,senderId} = data;

    /*
    // create new message
    const message = await Message.create({
      content: content,
      author: userId,
      date: new Date(),
      type: "DIRECT",
    });
    */

    // find the user instance for the author
    const author = await UserSQL.findByPk(userId);

    // create a new message instance
    // const message = await Message.create({
    //   content: content,
    //   author: author,
    //   date: new Date(),
    //   type: "DIRECT",
    // });

    const message = await MessageSQL.create({
      content: content,
      author: userId,
      date: new Date(),
      type: "DIRECT",
    });

    


    //await MessageSQL.

    // find if conversation exist with this two users - if not create new
    /*
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverUserId] },
    });
    */

    //const { Op } = require("sequelize");

    
    console.log("ids are:",userId,receiverUserId);
   const conversationData= await ConversationParticipantsSQL.findOne({
      where: {
        userId: {
          [Op.eq]: userId, // Greater than or equal to 20.
          [Op.eq]: receiverUserId, // Less than or equal to 30.
        },
      }
  });

  console.log("id is:"+conversationData?.conversationId);

 



    if (conversationData!=null && conversationData.conversationId!=null) {
    //  conversation.messages.push(message._id);
   //   await conversation.save();
console.log("updating existing conversation")
 let conversation = await ConversationSQL.findByPk(conversationData.conversationId);

   await conversation.addMessage((message._id));

  
      // perform and update to sender and receiver if is online
      chatUpdates.updateChatHistory(conversation._id.toString());
    }
    
    else {
      // create new conversation if not exists
      //const newConversation = await Conversation.create({
      //  messages: [message._id],
      //  participants: [userId, receiverUserId],
      //});

      console.log("creating new conversation");
      let newConversation= await ConversationSQL.create();

       await   newConversation.addMessage(message._id);
       await   newConversation.addUsers([userId,receiverUserId]);
        // newConversation.addParticipant(receiverUserId);
      

             


      // perform and update to sender and receiver if is online
      chatUpdates.updateChatHistory(newConversation._id.toString());
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = directMessageHandler;
