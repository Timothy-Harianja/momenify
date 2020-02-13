const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: String,
  nickname: String,
  password: String,
  email: String
});

module.exports = mongoose.model("User", UserSchema);
