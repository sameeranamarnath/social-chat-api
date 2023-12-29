This application can be used by creators to stream and view live sessions and screenshares while chatting with other creators. It uses React,Nodejs,Sequelize, PostgreSQL( RDS is good via Aurora, ), AWS, Redis,DynamoDB(Optional,not used in the latest version),Socket.io

Improvements:
a)I tried using Amazon IVS which seems more reliable
b) Using a separate media server like amazon ivs would facilitate usage of websockets from a service like api gateway which would enable high scalability and more concurrent connections

The api and socket servers are currently deployed via Railway
as it has a generous free tier:
https://social-chat-api-production.up.railway.app
