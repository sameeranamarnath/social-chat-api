const chatUpdates = require("./updates/chat");
const ConversationSQL = require("../models/models").Conversation;
const { Op } = require("sequelize");
const UserSQL = require("../models/models").User;
const ConversationParticipantsSQL = require("../models/models").ConversationParticipants
const directChatHistoryHandler = async (socket, data) => {
  try {
    const { userId } = socket.user;
    const { receiverUserId } = data;
/*
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverUserId] },
      type: "DIRECT",
    }); */
   //

   //const ConversationParticipantsSQL = require("../models/models").ConversationParticipants

   console.log("chat history for:",userId,":",receiverUserId);
   const conversationData = await ConversationParticipantsSQL.findOne({
    where: {
      userId: {
        [Op.eq]: userId, // Greater than or equal to 20.
        [Op.eq]: receiverUserId, // Less than or equal to 30.
      }
    }
  });




    if (conversationData!=null && conversationData.conversationId!=null) {
      chatUpdates.updateChatHistory(conversationData.conversationId.toString(), socket.id);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = directChatHistoryHandler;
