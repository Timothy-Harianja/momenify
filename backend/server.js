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
const router = express.Router();
const loginRoute = require("./routes/login-route.js");
const signupRote = require("./routes/signup-route");
const confirmationRoute = require("./routes/confirmation-route.js");
const path = require("path");

// app.use(cors(corsOptions));
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
// app.use(express.static(path.join(__dirname, "../frontend/build")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(cors());

app.use("/api", signupRote);
app.use("/api", loginRoute);
app.use("/api", confirmationRoute);

if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  // index.html for all page routes
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
// launch our backend into a port

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
