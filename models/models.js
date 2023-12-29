const Sequelize = require('sequelize');
//const db = require('../config/database');
// Create a new Sequelize instance with the PostgreSQL connection parameters
const sequelizeInstance = new Sequelize({
    dialect: 'postgres',
    database: 'verceldb',
    logging: false,
    username: process.env.POSTGRES_USERNAME,
    password:process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_AURORA_ENDPOINT,
    port: 5432, // Adjust if your RDS port differs
    ssl: true, // Use SSL for security
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false, // Adjust based on your security requirements
      },
    },
    pool: {
      maxConnections: 5, // Adjust pool size based on your needs
      minConnections: 0,
      acquire: 30000, // 30 seconds to acquire a connection
      idle: 10000, // 10 seconds to keep an idle connection
    },
  });

  
const User = sequelizeInstance.define('user', {

    _id:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    username: {
      type: Sequelize.TEXT,
      allowNull: false,
      unique: true,
    },
    mail: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: false,
      }
      /*
      friends: {   
        type: Sequelize.ARRAY(Sequelize.UUID),
        allowNull: true,
        unique: false,
      }
      */
        

  }, {
    tableName: "users",
  });

  const UserFriend = sequelizeInstance.define('userFriend', {
    _id:{
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
  },
    // user1id: {
    //   type: Sequelize.UUID,
    //   allowNull: false,
    //   references: {
    //     model: User,
    //     key: '_id',
    //   },
    // },
    // user2id: {
    //   type: Sequelize.UUID,
    //   allowNull: false,
    //   references: {
    //     model: User,
    //     key: '_id',
    //   },
    // },
  });

  User.belongsToMany(User,{ through: UserFriend,as: "friends" });
  //User.belongsToMany(User,{ through: UserFriend,as: "from", foreignKey: "_id" });
  

  /*
  // Define the associations within both models.
  User.hasMany(User, {
    as: 'friends',
    through: UserFriend,
    foreignKey: 'userId',
  });
  
  User.hasMany(User, {
    as: 'friendsOf',
    through: UserFriend,
    foreignKey: 'friendId',
  });
  */
  //
  //User.Friends=User.hasMany(User, { joinTableName:"friendstable",as: 'friends' });
 // User.hasMany(User, { as: 'Contacts', joinTableName: 'userHasContacts'})
  
const Message = sequelizeInstance.define('message', {

 
    _id:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    
  author: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: '_id',
    },
  },
  
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  type: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
 
}, {
    tableName: "messages",
  });

  /*
  User.belongsTo(Message,{
    as:"author"
  })
  */

const Conversation = sequelizeInstance.define('conversation', {

   
    _id:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    }
    ,
    type:{
      type: Sequelize.TEXT,
      allowNull: true,

    }
  
}, {
    tableName: "conversations",
  });


  
  const ConversationMessages = sequelizeInstance.define('conversationmessages', {

   
    _id:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    }
    
  
});



  const ConversationParticipants = sequelizeInstance.define('conversationparticipants', {

   
    _id:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    }
    
  
});




   User.belongsToMany(Conversation,{
    through:ConversationParticipants
    
  });

  Conversation.belongsToMany(User,{
    through:ConversationParticipants
    
  });

  Message.belongsToMany(Conversation,{
    through:ConversationMessages
    
  });
  Conversation.belongsToMany(Message,{
    through:ConversationMessages
    
  });
  
/*  
  User.belongsToMany(Conversation,{
    as: 'participants',
    through:"conversationparticipants"
    
  });

  Conversation.messages= Conversation.belongsToMany(Message,{
    as: 'messageconversations',
    through:"conversationmessages"
    
  });
  
  */
  
  



const FriendInvitation = sequelizeInstance.define('friend_invitation', {

    _id:{
       type: Sequelize.UUID,
       defaultValue: Sequelize.UUIDV4,
       primaryKey: true,
   },
    
  
    senderId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: '_id',
      },
    },
    receiverId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: '_id',
      },
    }
    
    
  
  },
   {
    tableName: "friendinvitations",
  });



  
  // define associations
/*
  FriendInvitation.belongsToMany(User, {  
    through:FriendInvitation,
    foreignKey:"senderId"
});

User.belongsToMany(FriendInvitation, {
  through:FriendInvitation,
  foreignKey: "receiverId",
});

User.belongsToMany(FriendInvitation, {  
  through:FriendInvitation,
  foreignKey:"senderId"
});



User.belongsToMany(FriendInvitation, {  
  through:FriendInvitation,
 // foreig
 foreignKey:"receiverId"
});

FriendInvitation.belongsToMany(User, {  
      through:FriendInvitation,
      as:"senderId"
});
FriendInvitation.belongsToMany(User, {  
  through:FriendInvitation,
  as:"receiverId"
});
*/ 
/*
FriendInvitation.belongsTo(User, {
  as: "senderId",
  foreignKey: "senderId",
});

FriendInvitation.belongsTo(User, {
  as: "receiverId",
  foreignKey: "receiverId",
});

*/
  /*
  FriendInvitation.hasMany(User, {
    as:'senderId',
    foreignKey:'_id',
  })
  
  */
  


    
  async function init(callback){
  sequelizeInstance
  .authenticate()
  .then(async () => {
    console.log('Connection has been established successfully.');

  await sequelizeInstance.sync({ force: true   }).then(async () => {    
   //
     
  });

//   User.sync()
    console.log('Database and tables created successfully!');

 callback("success");

//init();
    }) .catch(err => {
    console.error('Unable to connect to the database:', err);
callback("failure",{err:err}); 
});
}
  
module.exports = { init, db: sequelizeInstance, Message, User, Conversation,ConversationMessages,ConversationParticipants, FriendInvitation };