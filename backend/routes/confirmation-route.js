const express = require("express");
const User = require("../user");
const router = express.Router();

function getToken(res) {
  let s = "";
  for (let i = res.length; i >= 0; i--) {
    if (res.charAt(i) != "/") {
      s = res.charAt(i) + s;
    } else {
      return s;
    }
  }
}

router.post("/active", (req, res) => {
  let tokenLink = req.headers.referer;
  token = getToken(tokenLink);

  User.findOne({ activeToken: token }, (err, user) => {
    if (err) {
      console.log("error finding an unactivated user: " + err);
      return res.json({
        success: false,
        message: "The account is already activated or the link is invalid!",
      });
    } else if (user == null) {
      return res.json({
        success: false,
        message: "The account is already activated or the link is invalid!",
      });
    } else if (user.activation == true) {
      return res.json({
        success: false,
        message: "The account is already activated!",
      });
    } else {
      user.activation = true;
      user.activeToken = null;
      user.save((err) => {
        if (err) {
          console.log("error saving activation");
        } else {
          return res.json({
            success: true,
            message: "Account activated!",
          });
        }
      });
    }
  });
});

module.exports = router;
