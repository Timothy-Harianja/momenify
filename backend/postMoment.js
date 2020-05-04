const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  nickname: String,
  userId: String,
  postmessage: String,
  postDate: Number,
  likeList: [],
  commentList: [],
  userLogo: String,
  postTime: String,
  hashtagList: [],
  fileLocation: String,
  uniqueID: String,
  objectKey: String,
  reportCount: Number,
  visible: Boolean,
});

module.exports = mongoose.model("Moment", PostSchema);
