const express = require("express");
const User = require("../user");
const Post = require("../postMoment");
const Hashtag = require("../hashtag");
const Meg = require("../chat-room");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const nodemailer = require("nodemailer");
const ObjectID = require("mongodb").ObjectID;
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "themomenify@gmail.com",
    pass: "cse312@project",
  },
});
const s3 = new aws.S3({
  accessKeyId: "AKIAJOTNL5MBC5VHYNTA",
  secretAccessKey: "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",
  Bucket: "momenify",
});

const profileImgUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "momenify",
    acl: "public-read",
    key: function (req, file, cb) {
      cb(
        null,
        path.basename(file.originalname, path.extname(file.originalname)) +
          "-" +
          Date.now() +
          path.extname(file.originalname)
      );
    },
  }),
  limits: { fileSize: 50 * 1000000 }, // In bytes: 1000000 bytes = 1 MB
}).single("myFiles");

router.post("/uploadLogo", (req, res) => {
  profileImgUpload(req, res, (error) => {
    if (error) {
      console.log("errors", error);
      return res.json({ success: false, message: "file too large" });
    } else {
      // If File not found
      if (req.file === undefined) {
        return res.json({ success: false });
      } else {
        const imageLocation = req.file.location;
        // Save the file name into database into profile model
        return res.json({
          success: true,
          imageLocation: imageLocation,
        });
      }
    }
  });
});

router.post("/updateInfo", (req, res) => {
  let username = req.body.userNickname;
  let currentLogo = req.body.currentLogo;
  if (username.trim().length == 0 || username == null) {
    return res.json({ success: false, message: "Name cannot be empty!" });
  }
  if (currentLogo.trim().length == 0 || currentLogo == null) {
    return res.json({ success: false, message: "Upload image failed!" });
  }
  User.findOneAndUpdate(
    { _id: req.session.userId },
    { nickname: username, logo: currentLogo },
    (err) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, message: "Updated failed" });
      } else {
        return res.json({ success: true, message: "Updated!" });
      }
    }
  );
  Post.updateMany(
    { userId: req.session.userId },
    { nickname: username, userLogo: currentLogo },
    (err) => {
      if (err) console.log(err);
    }
  );
});

let getFollow = (obj) => {
  return new Promise((resolve, reject) => {
    User.findOne({ _id: obj }, (err, result) => {
      if (err) console.log(err);

      if (result != null) {
        resolve([result.uniqueID, result.nickname, result.logo]);
      } else {
        resolve(null);
      }
    });
  });
};

let getAllFollow = (obj) => {
  let res = new Array(obj.length);
  for (let i = 0; i < obj.length; i++) {
    res[i] = new Promise((resolve, reject) => {
      getFollow(obj[i]).then((data) => {
        resolve(data);
      });
    });
  }
  return Promise.all(res);
};

router.post("/getFollower", (req, res) => {
  getAllFollow(req.body.followerList).then((result) => {
    return res.json({ success: true, followerResult: result });
  });
});

router.post("/getFollowing", (req, res) => {
  getAllFollow(req.body.followingList).then((result) => {
    return res.json({ success: true, followingResult: result });
  });
});

router.post("/contact-us", (req, res) => {
  note = {
    from: "themomenify@gmail.com",
    to: "jchen293@buffalo.edu",
    subject: "Someone submitted a form",
    text:
      req.body.name +
      " has submitted a form" +
      "\n" +
      "User email: " +
      req.body.email +
      "\n" +
      "User message: " +
      req.body.message,
  };
  transporter.sendMail(note);
  return res.json({ success: true, message: "submitted" });
});

router.post("/career", (req, res) => {
  note = {
    from: "themomenify@gmail.com",
    to: "jchen293@buffalo.edu",
    subject: "Someone applied a job",
    text:
      req.body.name +
      " has submitted a job form" +
      "\n" +
      "User email: " +
      req.body.email +
      "\n" +
      "User phone: " +
      req.body.phone +
      "\n" +
      "User position: " +
      req.body.position +
      "\n" +
      "User message: " +
      (req.body.message == null ? "None" : req.body.message) +
      "\n" +
      "User resume link: " +
      req.body.resumeLink +
      "\n",
  };
  transporter.sendMail(note);
  return res.json({ success: true, message: "submitted" });
});

router.post("/deletePost", (req, res) => {
  if (req.body.key != null) {
    Post.findOne({ _id: req.body.deleteID }, (err, key) => {
      var params = {
        Bucket: "momenify",
        Key: key.objectKey,
      };

      s3.deleteObject(params, function (err, data) {
        if (err) console.log(err, err.stack);
      });
    });
  }

  Post.deleteOne({ _id: req.body.deleteID }, (err, result) => {
    if (err) console.log(err);
    if (result != null) {
      let hashtags = req.body.hashtags;
      for (let i = 0; i < hashtags.length; i++) {
        Hashtag.findOne({ hashtag: hashtags[i] }, (err, result2) => {
          let newCount = result2.count - 1;
          let id = result2._id;
          let newPostList = result2.postList;
          newPostList = newPostList.filter((item) => item != req.body.deleteID);
          if (newCount == 0) {
            Hashtag.deleteOne({ _id: id }, (err) => {
              if (err) console.log(err);
            });
          } else {
            Hashtag.findOneAndUpdate(
              { _id: id },
              { count: newCount, postList: newPostList },
              (err) => {
                if (err) console.log(err);
              }
            );
          }
        });
      }
    }
    return res.json({ success: true, message: "deleted" });
  });
});

router.post("/reportPost", (req, res) => {
  Post.updateOne(
    { _id: ObjectID(req.body.reportID) },
    { $inc: { reportCount: 1 } },
    (err, result) => {
      if (err) console.log(err);
    }
  );
  note = {
    from: "themomenify@gmail.com",
    to: "jchen293@buffalo.edu",
    subject: "Someone reported a post",
    text:
      "Post ID: " +
      req.body.reportID +
      "\n" +
      "report message: " +
      req.body.message,
  };
  transporter.sendMail(note);
  return res.json({ success: true, message: "submitted" });
});

router.post("/changeVisible", (req, res) => {
  Post.updateOne(
    { _id: ObjectID(req.body.postid) },
    { $set: { visible: req.body.visible } },
    (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ success: false });
      } else {
        return res.json({ success: true });
      }
    }
  );
});

function makeToken(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

router.post("/message", (req, res) => {
  let timestamp = new Date().getTime();

  let newRoom = new Meg();

  newRoom.users = [req.body.sender, req.body.receiver];
  newRoom.messageList = [[req.body.sender, req.body.message, timestamp]];
  newRoom.roomID = makeToken(20);
  newRoom.save((err) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    } else {
      return res.json({ success: true });
    }
  });
});

let getUser = (obj) => {
  return new Promise((resolve, reject) => {
    User.findOne({ _id: obj }, (err, result) => {
      if (err) console.log(err);

      if (result != null) {
        resolve(result.nickname);
      } else {
        resolve(null);
      }
    });
  });
};

let getAllUser = (obj) => {
  let res = new Array(obj.length);
  for (let i = 0; i < obj.length; i++) {
    res[i] = new Promise((resolve, reject) => {
      getUser(obj[i]).then((data) => {
        resolve(data);
      });
    });
  }
  return Promise.all(res);
};

router.get("/getMessage", (req, res) => {
  Meg.find({ users: req.session.userId }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      let chatters = [];
      let roomList = [];
      let messageList = [];
      for (let i = 0; i < result.length; i++) {
        chatters.push(
          result[i].users[0] == req.session.userId
            ? result[i].users[1]
            : result[i].users[0]
        );
        roomList.push(result[i].roomID);
        messageList.push(result[i].messageList);
      }
      getAllUser(chatters).then((result2) => {
        chatterList = [];
        for (let j = 0; j < result2.length; j++) {
          chatterList.push([result2[j], chatters[j]]);
        }
        // console.log("result from get message: ", result);
        return res.json({
          chatters: chatterList,
          roomList: roomList,
          messageList: messageList,
        });
      });
    }
  });
});
module.exports = router;
