const express = require("express");
const User = require("../user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "themomenify@gmail.com",
    pass: "cse312@project",
  },
});

const router = express.Router();

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

router.post("/putUser", (req, res) => {
  var user = new User();
  User.countDocuments({}, function (err, c) {
    note = {
      from: "themomenify@gmail.com",
      to: "themomenify@gmail.com",
      subject: "A new user has signed up!",
      text:
        user.nickname +
        " has signed up our platform" +
        "\n" +
        "Total users so far: " +
        c,
    };
    transporter.sendMail(note);
  });
  user.nickname = req.body.nickname;
  user.email = req.body.email;
  user.lastLogin = req.body.lastLogin;
  user.activation = req.body.activation;
  user.activeToken = req.body.activeToken;
  user.logo = "https://momenify.s3.us-east-2.amazonaws.com/default.png";
  user.uniqueID = req.body.uniqueID.toLowerCase();
  user.password = hashPassword(req.body.password).then((result) => {
    user.password = result;

    User.findOne({ email: req.body.email }, function (err, result) {
      if (err) {
        console.log(err);
        return err;
      } else if (result != null) {
        console.log("result", result);
        return res.json({
          success: false,
          message: "This email has already registered",
        });
      } else {
        User.findOne({ uniqueID: req.body.uniqueID }, (err, result2) => {
          if (err) {
            console.log(err);
            return err;
          } else if (result2 != null) {
            return res.json({
              success: false,
              message:
                "This uniqueID has already exists, please pick a different one!",
            });
          } else {
            user.save((err) => {
              if (err) {
                console.log(err);
                return res.json({
                  success: false,
                  message: "User is not register",
                });
              } else {
                //console.log("req:", req.headers);
                tokenLink = req.headers.origin + "/active/" + user.activeToken;
                mail = {
                  from: "themomenify@gmail.com",
                  to: user.email,
                  subject: "Welcome to Momenify",
                  text:
                    "Thank you for signing up Momenify, below is your link for activation: \n" +
                    tokenLink +
                    "\n" +
                    "\n Momenify, Inc.",
                };
                transporter.sendMail(mail);
                return res.json({ success: true, message: "User Register" });
              }
            });
          }
        });
      }
    });
  });
});

module.exports = router;
