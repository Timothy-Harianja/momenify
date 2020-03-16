const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  nickname: String,
  userId: String,
  postmessage: String,
  postDate: String,
  likeList: [],
  userLogo: String
});

module.exports = mongoose.model("Moment", PostSchema);
