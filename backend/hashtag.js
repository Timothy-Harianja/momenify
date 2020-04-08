const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HashtagSchema = new Schema({
  hashtag: String,
  hashtagTime: String,
  count: Number,
});

module.exports = mongoose.model("Hashtag", HashtagSchema);
