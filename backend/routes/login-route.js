const express = require("express");
const router = express.Router();
const User = require("../user");
const bcrypt = require("bcryptjs");

router.post("/login", (req, res) => {
  console.log("req information in login:", req.body);
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
        console.log("result: ", result2.activation);
        if (result == true && result2.activation) {
          console.log("password  matches");

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
