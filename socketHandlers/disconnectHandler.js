const serverStore = require("../serverStore");
const roomLeaveHandler = require("./roomLeaveHandler");

const disconnectHandler = async (socket) => {
  const activeRooms = await serverStore.getActiveRooms();

  activeRooms.forEach((activeRoom) => {


    if(activeRoom.participants)
    {
    const userInRoom = activeRoom.participants.some(
      (participant) => participant.socketId === socket.id
    );

    if (userInRoom) {
      roomLeaveHandler(socket, { roomId: activeRoom.roomId });
    }

     }

  });

  await serverStore.removeConnectedUser(socket.id);
};

module.exports = disconnectHandler;
