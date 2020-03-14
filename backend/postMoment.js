const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var random = require("mongoose-simple-random");

const PostSchema = new Schema({
  nickname: String,
  userId: String,
  postmessage: String,
  postDate: String
});

PostSchema.plugin(random);

module.exports = mongoose.model("Moment", PostSchema);
