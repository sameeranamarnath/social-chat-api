const Sequelize = require('sequelize');
const db = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false
});

const Message = db.define('message', {
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false
  },
  type: {
    type: Sequelize.TEXT,
    allowNull: false
  }
});

const User = db.define('user', {
  username: {
    type: Sequelize.TEXT,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.TEXT,
    allowNull: false
  }
});

const Conversation = db.define('conversation', {
  participants: {
    type: Sequelize.ARRAY(Sequelize.UUID),
    allowNull: false
  },

});

User.hasMany(Conversation, { as: 'participants' });

const FriendInvitation = db.define('friend_invitation', {
  senderId: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: 'user',
      key: '_id'
    }
  },
  receiverId: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: 'user',
      key: '_id'
    }
  }
});

const query = {
  message: (parent, args) => Message.findById(args.id),
  messages: () => Message.findAll(),
  user: (parent, args) => User.findById(args.id),
  users: () => User.findAll(),
  conversation: (parent, args) => Conversation.findById(args.id),
  conversations: () => Conversation.findAll(),
  friendInvitation: (parent, args) => FriendInvitation.findById(args.id),
  friendInvitations: () => FriendInvitation.findAll()
};

const messageType = new GraphQLObjectType({
  name: 'Message',
  fields: () => ({
    _id: { type: GraphQLString },
    content: { type: GraphQLString },
    date: { type: GraphQLString },
    type: { type: GraphQLString }
  })
});

const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: { type: GraphQLString },
    username: { type: GraphQLString }
  })
});

const conversationType = new GraphQLObjectType({
  name: 'Conversation',
  fields: () => ({
    _id: { type: GraphQLString },
    participants: { type: new GraphQLList(userType) },
    messages: { type: new GraphQLList(messageType) },
    
  })
});

const friendInvitationType = new GraphQLObjectType({
  name: 'FriendInvitation',
  fields: () => ({
    _id: { type: GraphQLString },
    senderId: { type: userType },
    receiverId: { type: userType }
  })
});

const rootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: () => query
});

const server = new GraphQLServer({
  typeDefs: `
    type Query {
      message(_id: ID!): Message
      messages: [Message]
      user(_id: ID!): User
      users: [User]
      conversation(_id: ID!): Conversation
      conversations: [Conversation]
      friendInvitation(_id: ID!): FriendInvitation
      friendInvitations: [FriendInvitation]
    }

    type Message {
      _id: ID!
      content: String!
      date: String!
      type: String!
    }

    type User {
      _id: ID!
      username: String!
    }

    type Conversation {
      _id: ID!
      participants: [User!]!
      messages: [Message!]!
    }

    type FriendInvitation {
      _id: ID!
      senderId: User!
      receiverId: User!
    }
  `,
  resolvers: {
    Query: query,
    Message: messageType,
    User: userType,
    Conversation: conversationType,
    FriendInvitation: friendInvitationType
  }
});

server.applyMiddleware({ app, path: '/graphql' });

module.exports = {
  db,
  Message,
  User,
  Conversation,
  FriendInvitation,
  server
};