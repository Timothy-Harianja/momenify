const express = require("express");
const router = express.Router();
const User = require("../user");
const bcrypt = require("bcryptjs");

router.get("/session", (req, res) => {
  res.send(req.session);
});

router.post("/logout", (req, res) => {
  res.clearCookie();

  req.session.destroy(err => {
    if (err) {
      console.log(err);
    }
  });
});
router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, function(err, result2) {
    if (err) {
      console.log(err);
      return err;
    }
    if (result2 != null) {
      // check result's hashed password and the hash value of the given password
      bcrypt.compare(req.body.password, result2.password, function(
        err,
        result
      ) {
        if (result == true && result2.activation) {
          req.session.userId = result2._id;
          req.session.username = result2.nickname;
          req.session.email = result2.email;
          req.session.logoNumber = result2.logo;
          // console.log("req session in login:", req.session);

          return res.json({
            success: true,
            message: "login success"
          });
        } else {
          console.log(
            "password does not matches or the account is not yet activated!"
          );
          return res.json({
            success: false
          });
        }
      });
    } else {
      console.log("user not exist");
      return res.json({
        success: false
      });
    }
  });
});

module.exports = router;
