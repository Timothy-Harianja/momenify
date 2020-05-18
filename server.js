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

/*when join, add chatters and default roomId given,and socket.id
  when switch room, just change the roomId
  when exit, find the user using socket.id, then delete it
*/

let chatters = []; //elem [chatterId, roomId,socketId]
const socketio = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketio(server);
io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("join", ({ name, roomId }, callback) => {
    //check if roomId in chatRooms
    // console.log("chatrooms: ", chatRooms);

    console.log("JOIN");
    console.log("the roomId:   ", roomId, "  name: ", name);
    chatters.push([name, roomId, socket.id]);

    // addtoRoom({ chatterId: name, roomId: roomId, socketId: socket.id }); //param: myid, [roomid, id,id]
    console.log("chatters after ADDTOROOM", chatters);
    socket.join(roomId);
    callback();
  });

  socket.on(
    "sendMessage",
    ({ sender, receiver, message, roomId }, callback) => {
      let receiverIndex = chatters.findIndex(
        (chatter) => chatter[0] == receiver && chatter[1] == roomId
      );

      if (receiverIndex != -1) {
        //meaning that receiver is ready to chat now
        console.log("sendMessage rooomId that found:", roomId);
        // console.log("emit twice?");
        io.to(roomId).emit("message", { user: sender, text: message });
        callback({ success: true, roomId: roomId });
      } else {
        console.log("receiver is not online");
        callback({ success: false, roomId: roomId });
      }
    }
  );

  // socket.on("switchRoom", ({ userId, roomId }) => {
  //   let roomid = chatters[chatters.findIndex((user) => user[0] == userId)][1];
  //   console.log(" switchRoom ::before, roomid is:", roomid);
  //   console.log("before, chatters is:", chatters);
  //   switchRoom({ userId, roomId });
  //   socket.leave(roomid);
  //   socket.join(roomId, () => {
  //     console.log("switchRoom, what's the room now:", socket.rooms);
  //     console.log("switchRoom, what's the socket.id now:", socket.id);
  //   });

  //   roomid = chatters[chatters.findIndex((user) => user[0] == userId)][1];
  //   console.log(" switchRoom ::after, roomid is:", roomid);
  // });

  socket.on("disconnect", () => {
    chatters = chatters.filter((chatter) => chatter[2] == socket.id);
    console.log(socket.id, "  disconnected");
    console.log("chatters: ", chatters);
  });
});

// function addtoRoom({ chatterId, roomId, socketId }) {
//   let alreadyAdded = false;
//   chatters.map((chatter) => {
//     if (chatter[0] == chatterId) {
//       alreadyAdded = true;
//     }
//   });
//   if (!alreadyAdded) {
//     chatters.push([chatterId, roomId, socketId]);
//   }
// }

// function exitRoom(socketId) {
//   // let index = chatters.findIndex((user) => user[2] == socketId);
//   // if (index != -1) {
//   //   chatters.splice(index, 1);
//   //   return true;
//   // }
//   // return false;
// }

// function findReceiverRoom({ receiver, roomId }) {
//   // let senderIndex = chatters.findIndex((chatter) => chatter[0] == sender);
//   let receiverIndex = chatters.findIndex(
//     (chatter) => chatter[0] == receiver && chatter[1] == roomId
//   );
//   if (receiverIndex == -1) {
//     console.log("receiver is not online now");
//     return { roomId: "", online: false };
//   }
//   console.log("receiver is online");
//   console.log("receiver room:", chatters[receiverIndex][1]);
//   return { roomId: chatters[receiverIndex][1], online: true };
// }

function switchRoom({ userId, roomId }) {
  let index = chatters.findIndex((chatter) => chatter[0] == userId);
  if (index != -1) {
    chatters[index][1] = roomId;
    return true;
  } else {
    console.log("error switch room, chatters dosn't record userid");
    return false;
  }
}
server.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
