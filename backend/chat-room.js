const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatRoomSchema = new Schema({
  users: [],
  messageList: [],
  roomID: String,
});

module.exports = mongoose.model("Meg", ChatRoomSchema);
