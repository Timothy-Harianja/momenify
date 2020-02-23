const express = require("express");
const router = express.Router();
const User = require("../user");
const bcrypt = require("bcryptjs");

router.post("/login", (req, res) => {
  console.log("req information in login:", req.body);
  User.findOne({ email: req.body.email }, function(err, result) {
    if (err) {
      console.log(err);
      return err;
    }
    if (result != null) {
      // check result's hashed password and the hash value of the given password
      bcrypt.compare(req.body.password, result.password, function(err, result) {
        if (result == true) {
          //res.redirect("/home");
          console.log("password  matches");

          return res.json({
            success: true
          });
        } else {
          //res.send("Incorrect password");
          //res.redirect("/");
          console.log("password does not matches");
          return res.json({
            success: false
          });
        }
      });
      return "password incorrect";
    } else {
      console.log("user not exist");
      return "user not exist";
    }
  });
});

module.exports = router;
