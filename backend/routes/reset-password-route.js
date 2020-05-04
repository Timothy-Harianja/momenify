const express = require("express");
const router = express.Router();
const User = require("../user");
const bcrypt = require("bcryptjs");

async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });

  return hashedPassword;
}

router.post("/resetPassword", (req, res) => {
  User.findOne({ email: req.session.email }, function (err, user) {
    if (err) {
      console.log(err);
    }
    if (user != null) {
      bcrypt.compare(req.body.oldPassword, user.password, function (
        err,
        match
      ) {
        if (match && user.activation) {
          hashPassword(req.body.newPassword).then((result) => {
            user.password = result;
            user.save((error) => {
              if (err) {
                console.log(error);
                return err;
              }
              return res.json({ success: true });
            });
          });
        } else {
          return res.json({ success: false });
        }
      });
    } else {
      return res.json({ success: false });
    }
  });
});

module.exports = router;
