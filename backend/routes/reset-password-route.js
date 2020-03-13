const express = require("express");
const router = express.Router();
const User = require("../user");
const bcrypt = require("bcryptjs");

async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });

  return hashedPassword;
}

router.post("/resetPassword", (req, res) => {
  console.log("req.session:", req.session.email);
  console.log("server: reset password");

  User.findOne({ email: req.session.email }, function(err, user) {
    if (err) {
      console.log(err);
    }
    if (user != null) {
      bcrypt.compare(req.body.oldPassword, user.password, function(err, match) {
        if (match && user.activation) {
          console.log("old password matches");

          console.log(req.body.newPassword);
          hashPassword(req.body.newPassword).then(result => {
            user.password = result;
            user.save(error => {
              if (err) {
                console.log(error);
                return err;
              }
              console.log("changed password success");
              return res.json({ success: true });
            });
          });
        } else {
          console.log("old password incorrect");
          return res.json({ success: false });
        }
      });
    } else {
      console.log("user not found");
      return res.json({ success: false });
    }
  });
});

module.exports = router;
