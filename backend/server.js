const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
// const { ObjectId } = require("mongodb");
// const mongodb = require("mongodb");
const API_PORT = 3001;
const app = express();
var cors = require("cors"); //use cors for cross-site request
const User = require("./user");
const bcrypt = require("bcryptjs");

// var transporter = nodemailer.createTransport({
//   //   service: "gmail",
//   //   auth: {
//   //     user: "platformtest147@gmail.com",
//   //     pass: "CSE442@platformmail"
//   //   }
// });

const router = express.Router();

// const whitelist = [
//   "http://localhost:3000",
//   "http://localhost:3001",
//   "http://localhost:8000"
// ];

// var corsOptions = {
//   origin: function(origin, callback) {
//     if (origin == undefined || whitelist.indexOf(origin) != -1) {
//       console.log("true");
//       callback(null, true);
//     } else {
//       console.log("false");
//       callback(new Error("Not allowed by CORS"));
//     }
//   }
// };

// app.use(cors(corsOptions));
app.use(cors());
// this is our MongoDB database
const dbRoute =
  "mongodb+srv://junjie:jackjack@cse312-rdygi.mongodb.net/test?retryWrites=true&w=majority";

// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use("/", express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", router);

router.post("/putUser", (req, res) => {
  console.log("req: ", req.body);

  let user = new User();
  user.id = req.body.id;
  user.nickname = req.body.nickname;
  user.password = req.body.password;
  user.email = req.body.email;

  user.save(err => {
    if (err) {
      return "failed";
    } else {
      return "successed";
    }
  });
});

router.post("/login", (req, res) => {
  console.log("req information in login:", req.body);
  User.findOne({ email: req.body.email }, function(err, result) {
    if (err) {
      console.log(err);
      return err;
    }
    if (result != null) {
      // check result's hashed password and the hash value of the given password
      if (hashingPassword(req.body.password, 10) == result.password) {
        console.log("password matches!");
        return "true";
      }
      console.log("password does not matches");
      return "password incorrect";
    } else {
      console.log("user not exist");
      return "user not exist";
    }
  });
});

function hashingPassword(password, saltRounds) {
  bcrypt.genSalt(saltRounds, function(err, salt) {
    if (err) return err;
    bcrypt.hash(password, salt, function(err, hash) {
      if (err) return err;
      console.log("hash value", hash);
      return hash;
    });
  });
}

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
