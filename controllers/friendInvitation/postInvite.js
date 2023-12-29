const friendsUpdates = require("../../socketHandlers/updates/friends");
const UserSQL = require("../../models/models").User;
const FriendInvitationSQL =require("../../models/models").FriendInvitation;

const postInvite = async (req, res) => {
  const { targetMailAddress } = req.body;

  const { userId, mail } = req.user;

  // check if friend that we would like to invite is not user

  if (mail.toLowerCase() === targetMailAddress.toLowerCase()) {
    return res
      .status(409)
      .send("Sorry. You cannot become friend with yourself");
  }

  //const targetUser = await User.findOne({
   // mail: targetMailAddress.toLowerCase(),
  //});

  const targetUser = await UserSQL.findOne({
    where:{
      mail: targetMailAddress.toLowerCase()
    } });


  if (!targetUser) {
    return res
      .status(404)
      .send(
        `Friend of ${targetMailAddress} has not been found. Please check mail address.`
      );
  }

  // check if invitation has been already sent
  const invitationAlreadyReceived = await FriendInvitationSQL.findOne({
    where:{
    senderId: userId,
    receiverId: targetUser._id,
    }
  });
console.log("Existing invitaiton",invitationAlreadyReceived);
  console.log("existing invitation ",{
    senderId:  userId,
    receiverId: targetUser._id,
    });

  if (invitationAlreadyReceived!=null) {
    return res.status(409).send("Invitation has been already sent");
  }

  // check if the user whuch we would like to invite is already our friend
  //const usersAlreadyFriends = targetUser.friends.find(
  //  (friendId) => friendId.toString() === userId.toString()
  //);


  const userInFriendsList =await  targetUser.getFriends();
  
  //console.log(await targetUser.getFriends());
  //if (usersAlreadyFriends) {
    
  if(userInFriendsList && userInFriendsList.find(
      (friend) => friend._id.toString() === userId.toString()
    ))
  {
    console.log("friends list:"+userInFriendsList[0]._id);
  
  return res
      .status(409)
      .send("Friend already added. Please check friends list");
  }

  
  // create new invitation in database
  //const newInvitation = await FriendInvitation.create({
   // senderId: userId,
   // receiverId: targetUser._id,
  //});

  const newInvitation = await FriendInvitationSQL.create({
    senderId: userId,
    receiverId: targetUser._id,
  });

  // if invtiation has been successfully created we would like to update friends invitations if other user is online

  // send pending invitations update to specific user
  friendsUpdates.updateFriendsPendingInvitations(targetUser._id.toString());

  return res.status(201).send("Invitation has been sent");
};

module.exports = postInvite;
