const express = require("express");
const router = express.Router();
const User = require("../user");
const bcrypt = require("bcryptjs");

router.get("/session", (req, res) => {
  User.findOne({ email: req.session.email }, (err, result) => {
    if (err) {
      console.log("here is an arror", err);
      return res.json({ success: false });
    }
    if (result != null) {
      req.session.username = result.nickname;
      req.session.logoNumber = result.logo;

      return res.json({
        userId: req.session.userId,
        logoNumber: result.logo,
        following: result.following,
        email: result.email,
        username: result.nickname,
        uniqueID: result.uniqueID,
        success: true,
      });
    }
    return res.json({ success: false });
    // res.send(req.session);
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie();

  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
  });
});
router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, function (err, result2) {
    if (err) {
      console.log(err);
      return err;
    }
    if (result2 != null) {
      // check result's hashed password and the hash value of the given password
      bcrypt.compare(req.body.password, result2.password, function (
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
            message: "login success",
          });
        } else {
          console.log(
            "password does not matches or the account is not yet activated!"
          );
          return res.json({
            success: false,
          });
        }
      });
    } else {
      console.log("user not exist");
      return res.json({
        success: false,
      });
    }
  });
});

router.post("/userInfo", (req, res) => {
  console.log("is null?", req.body);
  if (req.body.userid == undefined) {
    console.log("checked undefined,");
    return res.json({
      success: false,
      userInfo: null,
      message: "your userid is undefined",
    });
  }
  User.findOne({ _id: req.body.userid }, (err, user) => {
    if (err) {
      return res.json({ success: false, userInfo: null });
    }
    return res.json({ success: true, userInfo: user });
  });
});

module.exports = router;
