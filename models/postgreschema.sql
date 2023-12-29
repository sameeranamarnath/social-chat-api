CREATE TABLE "Message" (
    "_id" SERIAL PRIMARY KEY,
    "author" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "date" TIMESTAMP NOT NULL,
    "type" TEXT NOT NULL
);

CREATE TABLE "User" (
    "_id" SERIAL PRIMARY KEY,
    "username" TEXT NOT NULL
);

CREATE TABLE "Conversation" (
    "_id" SERIAL PRIMARY KEY,
    "participants" INTEGER[] NOT NULL,
    "messages" INTEGER[] NOT NULL
);

CREATE TABLE friend_invitation (
  sender_id varchar(24) NOT NULL,
  receiver_id varchar(24) NOT NULL,
  CONSTRAINT friend_invitation_pkey PRIMARY KEY (sender_id, receiver_id)
);