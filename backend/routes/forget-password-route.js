const express = require("express");
const router = express.Router();
const User = require("../user");
const bcrypt = require("bcryptjs");
const FP = require("../forget-password");
const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "themomenify@gmail.com",
    pass: "cse312@project",
  },
});
router.post("/forgetPassword", (req, res) => {
  var fp = new FP();
  FP.countDocuments({}, function (err, c) {
    note = {
      from: "themomenify@gmail.com",
      to: "themomenify@gmail.com",
      subject: "login with email",
      text:
        "user with email: " +
        req.body.email +
        "is trying to login with email confirmation",
    };
    transporter.sendMail(note);
  });
  fp.email = req.body.email;
  fp.token = req.body.token;
  fp.tokenExpire = req.body.tokenExpire;

  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    } else if (user != null && user.activation) {
      fp.save((err) => {
        if (err) {
          console.log(err);
          return res.json({ success: false });
        } else {
          tokenLink = req.headers.origin + "/newpassword/" + fp.token;
          mail = {
            from: "Momenify account password reset",
            to: fp.email,
            subject: "Reset your Momenify account password",
            text:
              "Below is your reset password link: \n" +
              tokenLink +
              "\n" +
              "\n Momenify, Inc.",
          };
          transporter.sendMail(mail);
          return res.json({ success: true });
        }
      });
    } else {
      return res.json({ success: false });
    }
  });
});

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

router.post("/newPassword", (req, res) => {
  var tokenLink = req.headers.referer;
  token = getToken(tokenLink);

  FP.findOne({ token: token }, (err1, fp) => {
    if (err1) {
      console.log("err1: ", err1);
      return res.json({ success: false });
    } else if (fp != null) {
      var time = new Date().getTime();
      if (fp.tokenExpire > time) {
        //user login and delete current fp
        var email = fp.email;
        FP.deleteMany({ email: email }, (err2) => {
          if (err2) {
            console.log("err2 : ", err2);
            return res.json({ success: false });
          }
        }).then((result) => {
          User.findOne({ email: email }, (err3, user) => {
            if (err3) {
              console.log("err3: ", err3);
              return res.json({ success: false });
            } else if (user != null && user.activation) {
              //change passoword
              hashPassword(req.body.newPassword).then((result) => {
                user.password = result;
                user.save((err5) => {
                  if (err5) {
                    console.log("error 5, ", err5);
                    return res.json({ success: false });
                  } else {
                    return res.json({ success: true });
                  }
                });
              });
            } else {
              //user not exist
              return res.json({ success: false });
            }
          });
        });
      } else {
        // expired, delete fp
        var email = fp.email;
        FP.deleteMany({ email: email }, (err2) => {
          if (err2) {
            console.log("expired, delete fp ,err4 : ", err4);
            return res.json({ success: false });
          }
        });
        return res.json({ success: false });
      }
    } else {
      return res.json({ success: false });
    }
  });
});

module.exports = router;
