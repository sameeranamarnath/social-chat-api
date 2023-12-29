const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { ApolloServer, gql } = require('apollo-server-express');
const { execute, subscribe } = require('graphql');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { createConnection } = require('typeorm');
const { join } = require('path');


const {
  db,
  Message,
  User,
  Conversation,
  FriendInvitation,
  server,
  init
} = require('./models/models');
init(onInit);
let onInit=function(status,error) {
    const app = express();

    // middleware
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(morgan('dev'));
    app.use(helmet());

    // create Socket.IO server
    const io = new Server(createServer(app));

    // subscribe to new message
    io.on('connection', (socket) => {
      console.log('a user connected');

      socket.on('subscribe', ({ conversationId }) => {
        console.log(`user ${socket.id} is subscribing to conversation ${conversationId}`);

        subscribe(
          {
            schema: server.schema,
            document: gql`
              subscription NewMessage($conversationId: ID!) {
                newMessage(conversationId: $conversationId) {
                  _id
                  author {
                    _id
                    username
                  }
                  content
                  date
                  type
                }
              }
            `,
            variables: { conversationId },
          },
          (err, payload) => {
            if (err) {
              console.error(err);
              return;
            }

            console.log(`user ${socket.id} received new message`);
            socket.emit('message', payload.data.newMessage);
          }
        );
      });
    });

    // start server
    app.listen({ port: 4000 }, () =>
      console.log(`Server is running on http://localhost:4000${server.graphqlPath}`)
    );
  }
  //)
  //.catch(error => console.error(error));