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
    pass: "cse312@project"
  }
});
router.post("/forgetPassword", (req, res) => {
  var fp = new FP();
  FP.countDocuments({}, function(err, c) {
    note = {
      from: "themomenify@gmail.com",
      to: "themomenify@gmail.com",
      subject: "login with email",
      text:
        "user with email: " +
        req.body.email +
        "is trying to login with emil confirmation"
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
      fp.save(err => {
        if (err) {
          console.log(err);
          return res.json({ success: false });
        } else {
          //   tokenLink = req.header.origin + "/emailLogin/" + fp.token;
          console.log("req: ", req);
          tokenLink = req.headers.origin + "/emailLogin/" + fp.token;
          mail = {
            from: "themomenify@gmail.com",
            to: fp.email,
            subject: "Welcome to Momenify",
            text:
              "This is a confirmation email for login, below is your link for confirmation: \n" +
              tokenLink +
              "\n" +
              "\n Momenify, Inc."
          };
          transporter.sendMail(mail);
          return res.json({ success: true });
        }
      });
    } else {
      console.log("user doesn't exist");
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
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });

  return hashedPassword;
}

router.post("/emailLogin", (req, res) => {
  console.log("emailLogin");
  var tokenLink = req.headers.referer;
  token = getToken(tokenLink);
  console.log("token, ", token);

  FP.findOne({ token: token }, (err1, fp) => {
    if (err1) {
      console.log("err1: ", err1);
      return res.json({ success: false });
    } else if (fp != null) {
      var time = new Date().getTime();
      console.log("current time: ", time);
      if (fp.tokenExpire > time) {
        //user login and delete current fp
        var email = fp.email;
        FP.deleteMany({ email: email }, err2 => {
          if (err2) {
            console.log("err2 : ", err2);
            return res.json({ success: false });
          }
        }).then(result => {
          console.log("result after delete fp; ", result);
          User.findOne({ email: email }, (err3, user) => {
            if (err3) {
              console.log("err3: ", err3);
              return res.json({ success: false });
            } else if (user != null && user.activation) {
              //change passoword
              hashPassword(req.body.newPassword).then(result => {
                user.password = result;
                console.log("new passsword set )))))))))))),", result);
                user.save(err5 => {
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
              console.log("user not exist during the email login process");
              return res.json({ success: false });
            }
          });
        });
      } else {
        // expired, delete fp
        var email = fp.email;
        FP.deleteMany({ email: email }, err2 => {
          if (err2) {
            console.log("expired, delete fp ,err4 : ", err4);
            return res.json({ success: false });
          }
        });
        console.log("expired, delete fp");
        return res.json({ success: false });
      }
    } else {
      console.log("fp doesn't exist");
      return res.json({ success: false });
    }
  });
});

module.exports = router;
