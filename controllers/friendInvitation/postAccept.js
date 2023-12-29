const FriendInvitationSQL = require("../../models/models").FriendInvitation;
const UserSQL = require("../../models/models").User;

const friendsUpdates = require("../../socketHandlers/updates/friends");

const postAccept = async (req, res) => {
  try {
    const { id } = req.body;

    //const invitation = await FriendInvitation.findById(id);

    const invitation = await FriendInvitationSQL.findOne({
      where:{
        _id: (id)
      }
    });
      
    if (!invitation) {
      return res.status(401).send("Error occured. Please try again");
    }

    const { senderId, receiverId } = invitation;

    const senderUser = await UserSQL.findOne({
      where:{
        _id: senderId
      }
    });

    const receiverUser = await UserSQL.findOne({
      where:{
        _id: receiverId
      }
    });

    //senderUser.friends = [...senderUser.friends, receiverId];
    //receiverUser.friends = [...receiverUser.friends, senderId];

     
     //by virtue of hasMany relationship
     await senderUser.addFriend(receiverUser);
     await receiverUser.addFriend(senderUser);
     

     /*
     await senderUser.update({
      friends: Sequelize.fn('concat', Sequelize.col('friends'), receiverId),
    });
    
    await receiverUser.update({
      friends: Sequelize.fn('concat', Sequelize.col('friends'), senderId),
    });
      
  */
    // add friends to both users
    //const senderUser = await User.findById(senderId);

   // await models.User.fi
    //senderUser.friends = [...senderUser.friends, receiverId];

    //const receiverUser = await User.findById(receiverId);
    //receiverUser.friends = [...receiverUser.friends, senderId];

    //await senderUser.save();
    //await receiverUser.save();

    // delete invitation
  //  await FriendInvitation.findByIdAndDelete(id);

    await FriendInvitationSQL.destroy({
      where:{ 
      
         _id:(id)
      }
    })

    // update list of the friends if the users are online
    friendsUpdates.updateFriends(senderId.toString());
    friendsUpdates.updateFriends(receiverId.toString());

    // update list of friends pending invitations
    friendsUpdates.updateFriendsPendingInvitations(receiverId.toString());

    return res.status(201).send("Friend successfuly added to known friend list");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong. Please try again",err);
  }
};

module.exports = postAccept;
