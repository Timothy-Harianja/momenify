const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
// const { ObjectId } = require("mongodb");
// const mongodb = require("mongodb");
const API_PORT = 5000;
const app = express();
var cors = require("cors"); //use cors for cross-site request
const loginRoute = require("./backend/routes/login-route.js");
const signupRote = require("./backend/routes/signup-route.js");
const confirmationRoute = require("./backend/routes/confirmation-route.js");
const resetPasswordRoute = require("./backend/routes/reset-password-route.js");
const forgetPasswordRoute = require("./backend/routes/forget-password-route.js");
const postMomentRoute = require("./backend/routes/postMoment-route.js");
const getMomentRoute = require("./backend/routes/getMoment-route.js");
const followChangeRoute = require("./backend/routes/follow-change-route.js");
const config = require("./backend/routes/config.js");
const path = require("path");
const session = require("express-session");

// app.use(cors(corsOptions));
// this is our MongoDB database
const dbRoute =
  "mongodb+srv://junjie:jackjack@cse312-rdygi.mongodb.net/test?retryWrites=true&w=majority";

// connects our back end code with the database

mongoose.connect(dbRoute, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
let db = mongoose.connection;
db.once("open", () => console.log("connected to the database"));
// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
// app.use(express.static(path.join(__dirname, "../frontend/build")));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(cors());
const oneYear = 1000 * 60 * 60 * 24 * 365;

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "quit it",
    cookie: {
      maxAge: oneYear,
      sameSite: true,
    },
  })
);

app.use("/api/signupRoute", signupRote);
app.use("/api/loginRoute", loginRoute);
app.use("/api/activeRoute", confirmationRoute);
app.use("/api/resetPasswordRoute", resetPasswordRoute);
app.use("/api/forgetPasswordRoute", forgetPasswordRoute);
app.use("/api/postRoute", postMomentRoute);
app.use("/api/getRoute", getMomentRoute);
app.use("/api/followChangeRoute", followChangeRoute);
app.use("/api/config", config);
// if (process.env.NODE_ENV == "production") {
app.use(express.static("frontend/build"));

//serve that index.html file ('*' means anything aside from these api routes above)
app.get("*", (req, res) => {
  //load the index.html file
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
});

// const server = app.listen(API_PORT, () =>
//   console.log(`LISTENING ON PORT ${API_PORT}`)
// );

/*elem: [room id, user1 name, user2 name].
  room doesn't need to be deleted for now since 
  we don't have a huge number of users.
  */
let chatRooms = [];
/*let you know that the user is ready to chat
  be deleted after socket disconnected
*/
let chatUser = []; //elem: userId
// const socketio = require("socket.io");
const http = require("http");
const server = http.Server(app);
const io = require("socket.io")(server);
io.on("connect", (socket) => {
  console.log("connected to socket.io");

  socket.on("join", ({ name, roomInfo }, callback) => {
    //check if roomId in chatRooms
    console.log("chatrooms: ", chatRooms);

    console.log("joined the room");
    console.log("the roomId:   ", roomInfo);

    addtoRoom({ myId: name, newRoom: roomInfo }); //param: myid, [roomid, id,id]
    console.log("the room:   ", roomInfo);
    socket.join(roomInfo[0]);
    // socket.emit("message", {
    //   user: "admin",
    //   text: name + ", welcome to room " + roomInfo[0],
    // });
    // socket.broadcast
    //   .to(roomInfo[0])
    //   .emit("message", { user: "admin", text: `${name} has joined!` });
    // io.to(roomId).emit('roomData', { room: roomId, users: getUsersInRoom(user.room) });
    callback();
  });

  socket.on("sendMessage", ({ sender, receiver, message }, callback) => {
    // let recRoom = findReceiverRoom(sender);
    // console.log("sendmessage recroom:", recRoom);

    // let receiver = "";
    // let roomId = "";
    // if (recRoom != []) {
    //   roomId = recRoom[0];
    //   receiver = recRoom[1];
    // }
    let roomId = findReceiverRoom([sender, receiver]);
    // console.log("the message you sent:", roomId, "  ", message);
    console.log("emit twice?");
    io.to(roomId).emit("message", { user: sender, text: message });
    callback("got a call back");
  });

  socket.on("disconnect", ({ user }) => {
    // exitRoom(user);
    console.log("disconnected");
    // io.to(roomId).emit("message", {
    //   user: "Admin",
    //   text: user + "has left.",
    // });
  });
});

function addtoRoom({ myId, newRoom }) {
  let alreadyAdded = false;
  chatRooms.map((chatRoom) => {
    if (chatRoom[0] == newRoom[0]) {
      alreadyAdded = true;
    }
  });
  if (!alreadyAdded) {
    chatRooms.push(newRoom);
  }
  //should not contain myId
  if (!chatUser.includes(myId)) {
    chatUser.push(myId);
  }
}

function exitRoom(myId) {
  // if (chatRooms.length == 0) {
  //   console.log("chatroom is empty");
  //   return false;
  // }

  // //find the index of room
  // let index = chatRooms.findIndex((chatRoom) => chatRoom[0] == delRoomId);
  // console.log("exitRoom index: ", index);
  // let receiverId = chatRooms[index][1];
  // if (receiverId == myId) {
  //   receiverId = chatRooms[index][2];
  // }
  // //check if the receiver in the charUser list, if not remove the room from chatRoom
  // let receiverInRoom = chatUser.includes(receiverId);
  // if (!receiverInRoom) {
  //   chatRooms.splice(index, 1);
  // }
  chatUser.splice(
    chatUser.findIndex((user) => user == myId),
    1
  );
  return true;
}

function findReceiverRoom(users) {
  //find the index of room which contains sender(id)
  // let index = -1;
  // let receiver = "";
  // let roomId = "";
  // index = chatRooms.findIndex((room) => room.includes(sender));
  // if (index == -1) {
  //   console.log("error: don't find a room contains your id");
  //   return [];
  // }
  // roomId = chatRooms[index][0];
  // let id1 = chatRooms[index][1];
  // let id2 = chatRooms[index][2];
  // if (sender == id1) {
  //   receiver = id2;
  // } else {
  //   receiver = id1;
  // }
  let sender = users[0];
  let receiver = users[1];

  let index = chatRooms.findIndex(
    (room) => room.includes(sender) && room.includes(receiver)
  );
  if (index == -1) {
    console.log("doesn't find room with this sender and receiver");
    return "";
  }
  let roomId = chatRooms[index][0];
  return roomId;
}
server.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
