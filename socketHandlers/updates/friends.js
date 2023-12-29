//const User = require("../../models/user");
//const FriendInvitation = require("../../models/friendInvitation");
const serverStore = require("../../serverStore");
const UserSQL = require("../../models/models").User;
const FriendInvitationSQL = require("../../models/models").FriendInvitation;

const updateFriendsPendingInvitations = async (userId) => {
  try {
    // const pendingInvitations = await FriendInvitation.find({
    //   receiverId: userId,
    // }).populate("senderId", "_id username mail");


    const pendingInvitations = await FriendInvitationSQL.findAll({
      where: {
        receiverId: userId,
      }
    });
    const pendingInvitations2 = await FriendInvitationSQL.findAll({
      
    });

    console.log("User id:"+userId);
    //console.log("All invitations: " + typeof pendingInvitations2[0].receiverId + " " + pendingInvitations2[0].senderId);

    let flattenedInvitations =[];
    if (pendingInvitations && pendingInvitations.length > 0) {

      for (let  i = 0; i < pendingInvitations.length;i++) {
        console.log("PI:"+pendingInvitations[i]._id);
       const user = await UserSQL.findByPk(pendingInvitations[i].senderId);
       flattenedInvitations.push({_id:pendingInvitations[i]._id,  username:user.username, mail:user.mail,senderid:user._id});

      }
    
      }
    //pendingInvitations.forEach(invitation=> {invitation.senderId=
    //.populate("senderId", "_id username mail");


    console.log("Pending invitations are:"+flattenedInvitations);
    // find all active connections of specific userId
    const receiverList = await  serverStore.getActiveConnections(userId);

    const io = serverStore.getSocketServerInstance();

    receiverList.forEach((receiverSocketId) => {
      io.to(receiverSocketId).emit("friends-invitations", {
        pendingInvitations: flattenedInvitations ? flattenedInvitations : [],
      });
    });
  } catch (err) {
    console.log(err);
  }
};

const updateFriends = async (userId) => {
  try {
    // find active connections of specific id (online users)
    const receiverList = await serverStore.getActiveConnections(userId);

    if (receiverList.length > 0) {
      // const user = await User.findById(userId, { _id: 1, friends: 1 }).populate(
      //   "friends",
      //   "_id username mail"
      // );

      const user = await UserSQL.findOne({
        where: {
          _id: userId,
        }
      })

   

      if (user) {

           
const friends = await user.getFriends(); // Array of promises for User objects.
const populatedFriends = await Promise.all(friends.map((friend) => friend.reload())); // Array of fully populated User friends.

        const friendsList = populatedFriends.map((f) => {
          return {
            id: f._id,
            mail: f.mail,
            username: f.username,
          };
        });

        // get io server instance
        const io = serverStore.getSocketServerInstance();

        receiverList.forEach((receiverSocketId) => {
          io.to(receiverSocketId).emit("friends-list", {
            friends: friendsList ? friendsList : [],
          });
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  updateFriendsPendingInvitations,
  updateFriends,
};
