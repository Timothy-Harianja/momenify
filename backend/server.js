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
const nodemailer = require("nodemailer");
var crypto = require("crypto");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "themomenify@gmail.com",
    pass: "cse312@project"
  }
});

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
mongoose.connect(dbRoute, { useNewUrlParser: true, useUnifiedTopology: true });

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

async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });

  return hashedPassword;
}

router.post("/putUser", (req, res) => {
  var user = new User();
  User.countDocuments({}, function(err, c) {
    note = {
      from: "themomenify@gmail.com",
      to: "themomenify@gmail.com",
      subject: "A new user has signed up!",
      text:
        user.nickname +
        " has signed up our platform" +
        "\n" +
        "Total users so far: " +
        c
    };
    transporter.sendMail(note);
  });
  user.nickname = req.body.nickname;
  user.email = req.body.email;
  user.lastLogin = req.body.lastLogin;
  user.activation = req.body.activation;
  user.activeToken = req.body.activeToken;
  user.activeTokenExpire = req.body.activeTokenExpire;
  user.password = hashPassword(req.body.password).then(result => {
    user.password = result;
    user.save(err => {
      if (err) {
        console.log(err);
        return "failed";
      } else {
        //  console.log("stored");
        mail = {
          from: "themomenify@gmail.com",
          to: user.email,
          subject: "Welcome to Momenify",
          text:
            "Thank you for signing up Momenify, below is your link for activation: \n" +
            user.nickname +
            "\n" +
            "Please change your password under Account Page as soon as possible. \n\n UBPlatform"
        };
        transporter.sendMail(mail);
        return "successed";
      }
    });
  });
});

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
