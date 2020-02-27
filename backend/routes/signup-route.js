const express = require("express");
const User = require("../user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
// const signupPage = require("../frontend/src/components/login/login.jsx");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "themomenify@gmail.com",
    pass: "cse312@project"
  }
});

const router = express.Router();

router.get("/signup", (req, res) => {
  // res.render("/signup", null);
});
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

router.post("/putUser", (req, res) => {
  console.log("sigu up function called");
  var user = new User();
  User.countDocuments({}, function(err, c) {
    note = {
      from: "themomenify@gmail.com",
      to: "themomenify@gmail.com",
      subject: "A new user has signed up!",
      text:
        user.nickname +
        " has signed up our platform" +
        "\n" +
        "Total users so far: " +
        c
    };
    transporter.sendMail(note);
  });
  user.nickname = req.body.nickname;
  user.email = req.body.email;
  user.lastLogin = req.body.lastLogin;
  user.activation = req.body.activation;
  user.activeToken = req.body.activeToken;
  user.activeTokenExpire = req.body.activeTokenExpire;
  user.password = hashPassword(req.body.password).then(result => {
    user.password = result;

    User.findOne({ email: req.body.email }, function(err, result) {
      if (err) {
        console.log(err);
        return err;
      } else if (result != null) {
        console.log("result", result);
        return res.json({
          success: false,
          message: "User alreayd register"
        });
      } else {
        user.save(err => {
          if (err) {
            console.log(err);
            return res.json({
              success: false,
              message: "User is not register"
            });
          } else {
            // console.log("req:", req.headers.origin);
            tokenLink = req.headers.origin + "/active/" + user.activeToken;
            mail = {
              from: "themomenify@gmail.com",
              to: user.email,
              subject: "Welcome to Momenify",
              text:
                "Thank you for signing up Momenify, below is your link for activation: \n" +
                tokenLink +
                "\n" +
                "\n Momenify, Inc."
            };
            transporter.sendMail(mail);
            return res.json({ success: true, message: "User Register" });
          }
        });
      }
    });
  });
});

module.exports = router;
