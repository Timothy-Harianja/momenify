const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  nickname: String,
  password: String,
  email: String,
  lastLogin: String,
  activation: Boolean,
  activeToken: String,
  activeTokenExpire: String,
  logo: String,
  following: [],
  follower: [],
});

module.exports = mongoose.model("User", UserSchema);
