const express = require("express");
const User = require("../user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "themomenify@gmail.com",
    pass: "cse312@project"
  }
});

const router = express.Router();

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
    user.save(err => {
      if (err) {
        console.log(err);
        return "failed";
      } else {
        //  console.log("stored");
        mail = {
          from: "themomenify@gmail.com",
          to: user.email,
          subject: "Welcome to Momenify",
          text:
            "Thank you for signing up Momenify, below is your link for activation: \n" +
            user.nickname +
            "\n" +
            "\n Momenify"
        };
        transporter.sendMail(mail);
        return "successed";
      }
    });
  });
});

module.exports = router;
