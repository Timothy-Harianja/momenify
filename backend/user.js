const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  nickname: String,
  password: String,
  email: String,
  lastLogin: String,
  activation: Boolean,
  activeToken: String,
  following: [],
  follower: [],
  logo: String,
  uniqueID: String,
});

module.exports = mongoose.model("User", UserSchema);
