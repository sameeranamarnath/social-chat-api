const serverStore = require("../../serverStore");

const updateRooms =async  (toSpecifiedSocketId = null) => {
  const io = serverStore.getSocketServerInstance();
  const activeRooms = await serverStore.getActiveRooms();

  if (toSpecifiedSocketId) {
    io.to(toSpecifiedSocketId).emit("active-rooms", {
      activeRooms,
    });
  } else {
    io.emit("active-rooms", {
      activeRooms,
    });
  }
};

module.exports = {
  updateRooms,
};
