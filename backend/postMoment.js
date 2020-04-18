const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  nickname: String,
  userId: String,
  postmessage: String,
  postDate: String,
  likeList: [],
  commentList: [],
  userLogo: String,
  postTime: String,
  hashtagList: [],
  files: {
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number,
  },
});

module.exports = mongoose.model("Moment", PostSchema);
