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

const server = app.listen(API_PORT, () =>
  console.log(`LISTENING ON PORT ${API_PORT}`)
);

let chatRooms = []; //elem: [room id, user1 name, user2 name]
const socketio = require("socket.io");
const io = socketio(server);
io.on("connect", (socket) => {
  console.log("connected to socket.io");

  socket.on("join", ({ name, roomId }, callback) => {
    //check if roomId in chatRooms
    addtoRoom({ roomId: roomId, name: name });
    socket.join(roomId);
    socket.emit("message", {
      user: "admin",
      text: name + ", welcome to room " + roomId,
    });
    socket.broadcast
      .to(roomId)
      .emit("message", { user: "admin", text: `${name} has joined!` });
    callback();
  });

  socket.on("sendMessage", ({ name, room, message }, callback) => {
    io.to(room).emit("message", { user: name, text: message });
    callback();
  });

  socket.on("disconnect", ({ user, roomId }) => {
    exitRoom({ roomId: roomId, name: user });
    console.log("disconnected");
    io.to(roomId).emit("message", {
      user: "Admin",
      text: user + "has left.",
    });
  });
});

function addtoRoom(newRoom) {
  let alreadyAdded = false;
  chatRooms.map((chatRoom) => {
    if (chatRoom[0] == newRoom.roomId) {
      alreadyAdded = true;
    }
  });

  if (alreadyAdded) {
    //check if the room has space for user
    let position = chatRooms.findIndex(
      (chatRoom) => chatRoom[0] == newRoom.roomId
    );
    if (chatRooms[position][1] == "") {
      chatRooms[position][1] = newRoom.name;
    } else if (chatRooms[position][2] == "") {
      chatRooms[position][2] = newRoom.name;
    } else {
      console.log("error: the room is full");
    }
  } else {
    //room not created
    chatRooms.push([newRoom.roomId, newRoom.name, ""]);
  }
}

function exitRoom(delRoom) {
  let alreadyLeft = true;
  chatRooms.map((chatRoom) => {
    if (chatRoom[0] == delRoom.roomId) {
      alreadyLeft = false;
    }
  });

  if (!alreadyLeft) {
    let position = chatRooms.findIndex(
      (chatRoom) => chatRoom[0] == delRoom.roomId
    );
    if (chatRooms[position][2] == "") {
      //position 2 is empty, meaning only you in the room, then delete the room
      chatRooms.splice(position, 1);
    } else {
      //delete your name, and restruct the room
      if (chatRooms[position][1] == delRoom.name) {
        chatRooms[position][1] = chatRooms[position][2];
        chatRooms[position][2] = "";
      } else if (chatRooms[position][2] == delRoom.name) {
        chatRooms[position][2] = "";
      } else {
        //should not end up here because should have user's name
        console.log("don't find you in room");
      }
    }
  }
}
