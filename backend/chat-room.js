const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatRoom = new Schema({
  users: [],
  messageList: [],
});

module.exports = mongoose.model("ChatRoom", ChatRoomSchema);
