const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ForgetPasswordSchema = new Schema({
  email: String,
  token: String,
  tokenExpire: String
});

module.exports = mongoose.model("FP", ForgetPasswordSchema);
