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
const PendMsg = require("../pending-message");
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

getNote = (e) => {
  return new Promise((resolve, reject) => {
    User.findOne({ uniqueID: e[0] }, (err, result) => {
      if (err) console.log(err);
      if (result != null) {
        resolve([result.nickname, result.logo]);
      } else {
        resolve(null);
      }
    });
  });
};

getAllNote = (e) => {
  let res = new Array(e.length);
  for (let i = 0; i < e.length; i++) {
    res[i] = new Promise((resolve, reject) => {
      getNote(e[i]).then((result) => {
        resolve(result);
      });
    });
  }

  return Promise.all(res);
};
router.get("/getNotification", (req, res) => {
  User.findOne({ _id: req.session.userId }, (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ success: false });
    }
    if (result != null) {
      let unread = result.unread;

      let noteList = result.notification.reverse();
      getAllNote(noteList).then((result2) => {
        if (result2 != null) {
          for (let i = 0; i < result2.length; i++) {
            let postID = noteList[i][2];
            noteList[i][1] = result2[i][0] + " " + noteList[i][1];
            noteList[i][2] = result2[i][1];
            noteList[i].push(postID);
          }
        }
        return res.json({ success: true, noteList: noteList, unread: unread });
      });
    }
  });
});

router.post("/resetNote", (req, res) => {
  User.updateOne({ _id: req.body.id }, { $set: { unread: 0 } }, (err, res) => {
    if (err) console.log(err);
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

  Meg.findOne(
    {
      $or: [
        { users: [req.body.sender, req.body.receiver] },
        { users: [req.body.receiver, req.body.sender] },
      ],
    },
    (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, message: err });
      } else if (result != null) {
        console.log("chat-room already created,just update message");
        let updateMessageList = result.messageList;
        // console.log("1");
        updateMessageList = [
          [req.body.sender, req.body.message, timestamp],
          ...updateMessageList,
        ];
        result.messageList = updateMessageList;
        // console.log("2");

        result.save((err) => {
          if (err) {
            // console.log("3");
            console.log(err);
            return res.json({ success: false, message: err });
          } else {
            // console.log("5");
            return res.json({
              success: true,
              message: "message sending success",
            });
          }
        });
      } else {
        // console.log("4");
        //result is null, create new room
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
      }
    }
  );
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
        messageList.push({
          roomId: result[i].roomID,
          messages: result[i].messageList,
        });
      }
      getAllUser(chatters).then((result2) => {
        chatterList = [];
        for (let j = 0; j < result2.length; j++) {
          chatterList.push([result2[j], chatters[j]]);
        }

        return res.json({
          chatters: chatterList,
          roomList: roomList,
          messageList: messageList,
        });
      });
    }
  });
});

//init pending-message when user send a message that receiver is not there
router.post("/pendingMessage", (req, res) => {
  //req: [receiverId, roomId]
  let receiverId = req.body.receiverId;
  let roomId = req.body.roomId;

  //check if pendMsg has the receiver
  PendMsg.findOne({ receiverId: receiverId }, (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, message: err });
    } else if (result == null) {
      let pm = new PendMsg();
      pm.receiverId = receiverId;
      pm.pendingList = [[roomId, 1]];
      pm.save((err1) => {
        if (err1) {
          console.log("err when save pending message,first time");
          return res.json({ success: false, message: err1 });
        }
        return res.json({
          success: true,
          message: "pending message save success,first time",
        });
      });
    } else {
      let newResult = result;
      //check if roomId in the list
      let roomIndex = newResult.pendingList.findIndex(
        (msgRoom) => msgRoom[0] == roomId
      );
      if (roomIndex == -1) {
        newResult.pendingList.push([roomId, 1]);
      } else {
        let num = newResult.pendingList[roomIndex][1] + 1;
        newResult.pendingList[roomIndex][1] = num;
      }
      let newPendinglist = newResult.pendingList;
      PendMsg.updateOne(
        { receiverId: receiverId },
        { pendingList: newPendinglist },
        (err) => {
          if (err) {
            console.log("err save message in pm");
            return res.json({ success: false, message: "err" });
          } else {
            return res.json({
              success: true,
              message: "pending message save success",
            });
          }
        }
      );
      // return res.json({ success: false, message: "err" });
    }
  });
});

//
router.post("/processingMessage", (req, res) => {
  //req elem: {receiverId(user who process message,the current user),roomId}
  let receiverId = req.body.receiverId;
  let roomId = req.body.roomId;
  PendMsg.findOne({ receiverId: receiverId }, (err, result) => {
    if (err) {
      console.log("processing message err PendMsg.findone receiver:", err);
      return res.json({ success: false, message: err });
    } else if (result == null) {
      let err1 =
        "err: doesn't find pending message in database, receiverId not match";
      console.log(err1);
      return res.json({ success: false, message: err1 });
    } else {
      let newResult = result;
      let roomIndex = newResult.pendingList.findIndex(
        (room) => room[0] == roomId
      );
      newResult.pendingList[roomIndex][1] = 0;
      let newPendinglist = newResult.pendingList;
      PendMsg.updateOne(
        { receiverId: receiverId },
        { pendingList: newPendinglist },
        (err2) => {
          if (err2) {
            console.log("processingmessage newsult save err:", err);
            return res.json({ success: false, message: err2 });
          } else {
            return res.json({ success: true, message: "message processed" });
          }
        }
      );
    }
  });
});

//return every pending number in every room current user has
router.post("/getPendingNumber", (req, res) => {
  //req elem:receiverId
  let receiverId = req.body.receiverId;
  PendMsg.findOne({ receiverId: receiverId }, (err, result) => {
    if (err) {
      return res.json({ success: false, message: err, pendingList: [] });
    }
    // console.log("result get pendingnumber:", result);
    if (result == null) {
      //meaning current user don't have the pending record, return empty List
      // console.log(
      //   "meaning current user don't have the pending record, return empty List"
      // );
      return res.json({ success: true, message: "", pendingList: [] });
    } else {
      //return pendingList

      let retPendingList = result.pendingList;
      // console.log("retPendingList: ", retPendingList);
      return res.json({
        success: true,
        message: "",
        pendingList: retPendingList,
      });
    }
  });
});

router.get("/getSumPendingNumber", (req, res) => {
  let userId = req.session.userId;
  PendMsg.findOne({ receiverId: userId }, (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, sumPendingNumber: 0 });
    } else if (result == null) {
      return res.json({ success: true, sumPendingNumber: 0 });
    } else {
      let pendingList = result.pendingList;
      let sum = 0;
      pendingList.map((elem) => {
        sum += elem[1];
      });
      return res.json({ success: true, sumPendingNumber: sum });
    }
  });
});
module.exports = router;
