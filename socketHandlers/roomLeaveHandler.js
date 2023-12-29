const serverStore = require("../serverStore");
const roomsUpdate = require("./updates/rooms");

const roomLeaveHandler = async (socket, data) => {
  const { roomId } = data;

  const activeRoom =await  serverStore.getActiveRoom(roomId);

  if (activeRoom) {
   await  serverStore.leaveActiveRoom(roomId, socket.id);

    const updatedActiveRoom = await  serverStore.getActiveRoom(roomId);

    if (updatedActiveRoom) {
      updatedActiveRoom.participants.forEach((participant) => {
        socket.to(participant.socketId).emit("room-participant-left", {
          connUserSocketId: socket.id,
        });
      });
    }

    roomsUpdate.updateRooms();
  }
};

module.exports = roomLeaveHandler;
