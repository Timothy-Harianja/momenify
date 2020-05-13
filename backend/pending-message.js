const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PendingMessage = new Schema({
  receiverId: [],
  pendingList: [], //elem:{roomId: "roomid", pendingNumber: int }
});

module.exports = mongoose.model("PendMsg", PendingMessage);
