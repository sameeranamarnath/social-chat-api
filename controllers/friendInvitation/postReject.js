const friendsUpdates = require("../../socketHandlers/updates/friends");
const FriendInvitationSQL =require("../../models/models").FriendInvitation;

const postReject = async (req, res) => {
  try {
    const { id } = req.body;
    const { userId } = req.user;

    // remove that invitation from friend invitations collection
   // const invitationExists = await FriendInvitation.exists({ _id: id });

//    if (invitationExists) {
 //     await FriendInvitation.findByIdAndDelete(id);
  //  }


    await FriendInvitationSQL.destroy({
      where:{ 
      
         _id:id
      }
    })

    // update pending invitations
    friendsUpdates.updateFriendsPendingInvitations(userId);

    return res.status(200).send("Invitation succesfully rejected");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong please try again");
  }
};

module.exports = postReject;
