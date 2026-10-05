# social-chat-api

Backend for a creator chat app: live session rooms, screenshare signalling,
direct messages and friend invitations over Socket.io, with REST and GraphQL
surfaces on top of Postgres.

## What is in here

| Area | Path | Notes |
| --- | --- | --- |
| REST API | `server.js`, `routes/`, `controllers/` | Auth (register/login) and friend invitations |
| GraphQL | `serverGraphql.js`, `routes/graphqlRoutes.js` | Schema composed from the models with `graphql-compose-mongoose` |
| Sockets | `socketServer.js`, `socketHandlers/` | Rooms, join/leave, WebRTC signalling relay, direct chat, connection tracking |
| Live state | `serverStore.js` | Redis for connection and session state |
| Models | `models/` (`models.js`, `postgreschema.sql`) | Sequelize models plus the Postgres schema |
| Infra | `terraform/` | API Gateway, Lambda, DynamoDB, IAM |

## Flows

- **Auth** - register/login issues a JWT (`middleware/auth.js`); sockets are
  authenticated on connect (`middleware/authSocket.js`).
- **Friends** - invite, accept, reject; changes are pushed to the affected socket.
- **Rooms** - create a room, join/leave, relay screenshare signalling data, and
  broadcast room updates to participants.
- **DM** - direct message handler plus persisted chat history per pair.

## Stack

- Node.js, Express, Socket.io
- PostgreSQL via Sequelize; Redis for live connection state
- GraphQL (Apollo Server Express) alongside the REST routes
- JWT auth with bcrypt password hashing
- Terraform for the AWS side

## Config

Redis is read from the environment; nothing is hardcoded.

```
REDIS_URL=redis://<user>:<password>@<host>:<port>
```

## Run it

```
npm install
npm start
```
