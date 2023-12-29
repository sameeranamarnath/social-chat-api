const express = require("express");
const http = require("http");
const cors = require("cors");

const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();//
let models  = require('./models/models.js'); //
//const {
  //GetStreamSessionCommand,
  //IngestConfiguration,
  //IvsClient,
 // StreamEvent
//} 
const IVSClient= require('aws-sdk/clients/ivs')

//const IVS = new AWS.IVS({ region: 'your-region' });

const AWS= require('aws-sdk');

//const  
 // IvschatClient,
  //IvschatServiceException,
  //CreateRoomCommand
//} 

const channelName="newchannelforivs";

//console.log(IVS)  //

let  createIVS=async ()=>{

  try{

 let ivsClient = new AWS.IVS({ region:"us-east-1"});
 let ivsChatClient = new AWS.Ivschat({region:"us-east-1",apiVersion: '2020-07-14'});

  const createChannelCommand =  ({
   name: channelName,
   // type: process.env.IVS_CHANNEL_TYPE as ChannelType,
    ///preset: process.env
   //   .IVS_ADVANCED_CHANNEL_TRANSCODE_PRESET as TranscodePreset,
    //tags: { project: process.env.PROJECT_TAG as string }
  });
  
  // Create IVS chat room
  const createRoomCommand =  ({
    name: `${channelName}s-room`
   // tags: { project: process.env.PROJECT_TAG } //as string }
  });
  
  
  console.log("creating ivs stream");
  //const { channel, streamKey } = await ivsClient.createChannel(createChannelCommand).promise();

 const channel=await  ivsClient.getChannel({arn:"arn:aws:ivs:us-east-1:387899812183:channel/yMYMIbcxk4N5"}).promise();


  console.log("creating ivs chat room"); //
  const chatRoom = await ivsChatClient.createRoom(createRoomCommand).promise();  
 let streamKey= channel?.streamKey;
  const channelArn = channel?.arn;
  const ingestEndpoint = channel?.ingestEndpoint;
  const streamKeyValue = channel?.streamKey?.value;
  const streamKeyArn = streamKey?.arn;
  const playbackUrl = channel?.playbackUrl;
  //const chatRoomArn = chatRoom.arn;
  console.log(channel);
  console.log(chatRoom);

}catch(err)  {

  console.log("error is:",err);
  }
  
};


const socketServer = require("./socketServer");
const authRoutes = require("./routes/authRoutes");
const friendInvitationRoutes = require("./routes/manageInvitationRoutes.js");

const PORT = process.env.PORT || process.env.API_PORT;

const app = express();
app.use(express.json());
app.use(cors());

// register the routes
app.use("/api/auth", authRoutes);
app.use("/api/friend-invitation", friendInvitationRoutes);

const server = http.createServer(app);
socketServer.registerSocketServer(server);
   
//
 
models.init((status,err)=>{console.log(status,err)

  
  server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
    //const channel =  IVS.createChannel(params).promise();
    //console.lo
   // createIVS();
  
  
  
  }) 
  


}); //create tables if data doesn't exist
