const { v4: uuidv4 } = require("uuid");
const redis = require('redis');

const redisClient = redis.createClient({
  password: '4QHvXO112r3EtvaeuO7ei6fx7DjKMlsN',
  socket: {
      host: 'redis-17567.c325.us-east-1-4.ec2.cloud.redislabs.com',
      port: 17567
  }
});


redisClient.on('connect', () => {
  console.log('Connected to Redis!');
});
redisClient.on('error', (err) => {
  console.error('Redis error:', err); 
});


const connectedUsers = new Map();
let connectedUsersHSetStore= "chatappsconnectionsstore";
let activeRoomsCollectionStore="chatappactiveroomsstore";
let activeRooms = [];
let io = null;

const setSocketServerInstance = (ioInstance) => {
  io = ioInstance;
};

const getSocketServerInstance = () => {
  return io;
};

const addNewConnectedUser = async ( { socketId, userId }) => {
  //connectedUsers.set(socketId, { userId });
console.log("addnewconnecteduser", socketId);
  if(!redisClient.isOpen)
  {
    await redisClient.connect();
  }  
console.log(typeof socketId)
  // Set a key-value pair
await redisClient.hSet(connectedUsersHSetStore, socketId, JSON.stringify({ userId }));
console.log(`Added ${socketId} to ${connectedUsersHSetStore}`);
// , (err, reply) => {
//   if (err) {
//     console.error('Error setting map data:', err);
//   } else {
//     console.log(`Data added to ${connectedUsersHSetStore}:`, reply); // 1 (field added)
//   }
// });

  //await redisClient.set(socketId,userId);
  console.log("new connected users");
  //console.log(connectedUsers);
};

const removeConnectedUser = async (socketId) => {
  if(!redisClient.isOpen)
  {
    await redisClient.connect();
  }

  await redisClient.hDel(connectedUsersHSetStore, socketId) ;
  
  // , (err, reply) => {
  //   if (err) {
  //     console.error('Error deleting key:', err);
  //   } else if (reply === 1) {
  //     console.log(`${socketId} deleted successfully.`);
  //   } else {
  //     console.log('Key already deleted or never existed.');
  //   }
  // });
  
  console.log(`${socketId} deleted successfully`);
  /*
    if (connectedUsers.has(socketId)) {
    connectedUsers.delete(socketId);
    console.log("new connected users");
    console.log(connectedUsers);
  }

  */
};

const getActiveConnections = async (userId) => {
  
  
  const activeConnections = [];
/*
  connectedUsers.forEach(function (value, key) {
    if (value.userId === userId) {
      activeConnections.push(key);
    }
  });

  */

  if(!redisClient.isOpen)
  {
    await redisClient.connect();
  } 
  /*
0d81c635-817e-470c-be12-6e888011f1c0 : de02b677 7-0185-4558-81ac-5b7def000870
 0d81c635-817e-470c-be12-6e888011f1c0 : 71a45239-ca12-44e1-8949-d0160efea83d

  */
  console.log("started");
  let theArray=await redisClient.hGetAll(connectedUsersHSetStore);
  //, (err, theArray) => {
    // if (err) {
    //   console.error('Error getting hash data:', err);
    // } else if (theArray.length === 0) {
    //   console.log('Reached the end of the Hash!');
    // } else {

    //   console.log("Over here");
    //   // Process the key-value pairs in the array
    //   //hgetall is sync 
    //  
       for ( [key, value] of Object.entries(theArray))
        {
          // Process the key-value pair (e.g., log, display, manipulate)
          value=JSON.parse(value);
      //    console.log('Key:', key, 'Value:', value);
          if (value.userId === userId) {
            activeConnections.push(key);
          }
        }


      //  console.log('Active connections:', activeConnections);
        return activeConnections;
      
          

  //   }
  // });

};

const getOnlineUsers = async  () => {
  const onlineUsers = [];

  /*
  connectedUsers.forEach((value, key) => {
    onlineUsers.push({ socketId: key, userId: value.userId });
  });
*/

if(!redisClient.isOpen)
  {
    await redisClient.connect();
  }
  let theArray= await redisClient.hGetAll(connectedUsersHSetStore);
    //  theArray=JSON.parse
  // , (err, theArray) => {
  //   if (err) {
  //     console.error('Error getting hash data:', err);
  //   } else if (theArray.length === 0) {
  //     console.log('Reached the end of the Hash!');
  //   } else {
  //     // Process the key-value pairs in the array
  //     //hgetall is sync 
  //      

 // console.log(theArray);
  for ([key,value] of Object.entries(theArray))  
  {
          // Process the key-value pair (e.g., log, display, manipulate)
          value= JSON.parse(value)
        //  console.log('Key:', key, 'Value:', value);
          onlineUsers.push({ socketId: key, userId: value.userId });
 
        }

       console.log('OnlineUsers:', onlineUsers.length);
        return onlineUsers;
      
          

   // }
 // });






};

// rooms
const addNewActiveRoom = async (userId, socketId) => {
  const newActiveRoom = {
    roomCreator: {
      userId,
      socketId,
    },
    participants: [
      {
        userId,
        socketId,
      },
    ],
    roomId: uuidv4(),
  };

  //activeRooms = [...activeRooms, newActiveRoom];

  if(!redisClient.isOpen)
  {
    await redisClient.connect();
  }
  
  // Set a key-value pair
await redisClient.hSet(activeRoomsCollectionStore, newActiveRoom.roomId, JSON.stringify(newActiveRoom));
console.log(`Setting active room ${newActiveRoom} in ${activeRoomsCollectionStore}`)
/*
, (err, reply) => {
  if (err) {
    console.error('Error setting map data:', err);
  } else {
    console.log(`Data added to ${activeRoomsCollectionStore}:`, reply); // 1 (field added)
  }
});
*/

  //console.log("new active rooms: ");
  //console.log(activeRooms);

  return newActiveRoom;
};

const getActiveRooms =async  () => {
  //return [...activeRooms];

  if(!redisClient.isOpen)
  {
    await redisClient.connect();
  }
  let theArray=await redisClient.hGetAll(activeRoomsCollectionStore);
  
  // , (err, theArray) => {
  //   if (err) {
  //     console.error('Error getting hash data:', err);
  //   } else if (theArray.length === 0) {
  //     console.log('Reached the end of the Hash!');
  //   } else 
  

      let activeRooms=[]
      // Process the key-value pairs in the array
      //hgetall is sync 
        for ( [key, value] of Object.entries(theArray)) {
          // Process the key-value pair (e.g., log, display, manipulate)
          value=JSON.parse(value);
          //console.log('Key:', key, 'Value:', value);
          activeRooms.push(value);
 
        }

      //  console.log('ActiveRooms:', activeRooms);
        return activeRooms;
};

const getActiveRoom =async  (roomId) => {
  /*
  const activeRoom = activeRooms.find(
    (activeRoom) => activeRoom.roomId === roomId
  );
*/

if(!redisClient.isOpen)
  {
    await redisClient.connect();
  }
  let  activeRoom = await redisClient.hGet(activeRoomsCollectionStore, roomId);

  activeRoom= JSON.parse(activeRoom);
  if (activeRoom) {

    //console.log("Active room: " + activeRoom);
    return {
      ...activeRoom,
    };


  } else {
    return null;
  }
};

const joinActiveRoom = async (roomId, newParticipant) => {
  //const room = activeRooms.find((room) => room.roomId === roomId);

  if(!redisClient.isOpen)
  {
    await redisClient.connect();
  }


//  const activeRoom = await redisClient.hget('myHash', roomId);
let  activeRoom = await redisClient.hGet(activeRoomsCollectionStore, roomId);
activeRoom= JSON.parse(activeRoom);
  console.log("room has been found",activeRoom);

  if(!activeRoom.participants)
  {
    activeRoom.participants=[];
  }
activeRoom.participants.push(newParticipant);
await redisClient.hSet(activeRoomsCollectionStore, roomId, JSON.stringify(activeRoom))
// , (err, reply) => {
//   if (err) {
//     console.error('Error setting map data:', err);
 // } 
 // else {
   // console.log(`Data added to ${connectedUsersHSetStore}:`, reply); // 1 (field added)
   console.log("Active room updated with new participant on redis")
  //}
//});
  

};

const leaveActiveRoom =async  (roomId, participantSocketId) => {
 /*
  const activeRoom = activeRooms.find((room) => room.roomId === roomId);

  if (activeRoom) {
    const copyOfActiveRoom = { ...activeRoom };

    copyOfActiveRoom.participants = copyOfActiveRoom.participants.filter(
      (participant) => participant.socketId !== participantSocketId
    );

    activeRooms = activeRooms.filter((room) => room.roomId !== roomId);

    if (copyOfActiveRoom.participants.length > 0) {
      activeRooms.push(copyOfActiveRoom);
    }
  }
  */

  if(!redisClient.isOpen)
  {
    await redisClient.connect();
  }

  let  activeRoom = await redisClient.hGet(activeRoomsCollectionStore, roomId);
activeRoom= JSON.parse(activeRoom)
  console.log("room has been found",activeRoom);

activeRoom.participants=activeRoom.participants.filter(
  (participant) => participant.socketId !== participantSocketId
);

if(activeRoom.participants.length>0)
{
await redisClient.hSet(activeRoomsCollectionStore, roomId, JSON.stringify(activeRoom))
console.log(`Active room updated and  participant ${participantSocketId} removed on redis`)
// , (err, reply) => {
//   if (err) {
//     console.error('Error setting map data:', err);
//   } else {
//    // console.log(`Data added to ${activeRoomsCollectionStore} ${roomId}:`, reply); // 1 (field added)
//    console.log(`Active room updated and  participant ${participantSocketId} removed on redis`)
//   }
// });

}
else 
{
  console.log(`deleting empty room ${roomId} as there are no participants`);
  await redisClient.hDel(activeRoomsCollectionStore, participantSocketId)
  //  (err, reply) => {
  //   if (err) {
  //     console.error(`Error deleting empty active Room ${socketId}:`, err);
  //   } else if (reply === 1) {
  //     console.log(`${socketId} room deleted successfully as no participants.`);
  //   } else {
  //     console.log('Key already deleted or never existed.');
  //   }
  // });
  console.log(`${participantSocketId} room deleted successfully as no participants.`);

}





};

module.exports = {
  addNewConnectedUser,
  removeConnectedUser,
  getActiveConnections,
  setSocketServerInstance,
  getSocketServerInstance,
  getOnlineUsers,
  addNewActiveRoom,
  getActiveRooms,
  getActiveRoom,
  joinActiveRoom,
  leaveActiveRoom,
};
