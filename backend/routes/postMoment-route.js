const express = require("express");
const router = express.Router();
const Post = require("../postMoment");
const Hashtag = require("../hashtag");
const path = require("path");
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

/**
 * PROFILE IMAGE STORING STARTS
 */
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
  // fileFilter: function (req, file, cb) {
  //   checkFileType(file, cb);
  // },
}).single("myFiles");

let post = {
  postmessage: null,
  userId: null,
  nickname: null,
  currentDate: null,
  postTime: null,
  userLogo: null,
  hashtagList: [],
  files: null,
};
router.post("/upload", (req, res) => {
  profileImgUpload(req, res, (error) => {
    if (error) {
      console.log("errors", error);
      return res.json({ success: false, message: "file too large" });
    } else {
      // If File not found
      if (req.file === undefined) {
        return res.json({ success: false });
      } else {
        // If Success
        // Save the file name into database into profile model
        return res.json({
          success: true,
          key: req.file.key,
          imageLocation: req.file.location,
        });
      }
    }
  });
});

router.post("/postHashtag", (req, res) => {
  for (let i = 0; i < req.body.hashtagList.length; i++) {
    let hashtag = req.body.hashtagList[i].toLowerCase();
    Hashtag.findOne({ hashtag: hashtag }, (err, result) => {
      let hashtag = new Hashtag();
      if (err) {
        console.log(err);
        return res.json({
          success: false,
          message: "error posting the hashtag",
        });
      }
      if (result == null) {
        hashtag.count = 1;
        hashtag.hashtag = req.body.hashtagList[i].toLowerCase();
        hashtag.hashtagTime = req.body.currentTime;
        hashtag.postList = [req.body.postID];
        hashtag.save((err, newHashtag) => {
          if (err) {
            console.log(err);
            return res.json({ success: false, message: "Post hashtag failed" });
          }
        });
      } else {
        let newCount = result.count + 1;
        let id = result._id;
        let newPostList = result.postList;
        newPostList.push(req.body.postID);

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
});

router.post("/postComment", (req, res) => {
  if (!req.session.userId) {
    return res.json({
      success: false,
      message: "please login to comment a post",
    });
  }

  Post.findOne({ _id: req.body.postid }, (err, result) => {
    if (err) {
      return res.json({ success: false, message: "error finding the post" });
    }

    let commentMessage = req.body.postComment;
    result.commentList.push([req.session.uniqueID, commentMessage, new Date()]);
    result.save((err) => {
      if (err) {
        return res.json({
          success: false,
          message: "error save you like to database",
        });
      }
      return res.json({
        success: true,
        message: [
          req.session.uniqueID,
          commentMessage,
          req.body.userLogo,
          req.body.nickname,
          "0m",
        ],
      });
    });
  });
});

router.post("/giveLike", (req, res) => {
  if (!req.session.userId) {
    return res.json({ success: false, message: "please login to like a post" });
  }
  Post.findOne({ _id: req.body.postId }, (err, result) => {
    if (err) {
      // console.log(err);
      return res.json({ success: false, message: "error finding the post" });
    }

    if (result.likeList.includes(req.session.userId)) {
      return res.json({
        success: false,
        message: "you already liked this post",
      });
    }
    result.likeList.push(req.session.userId);
    result.save((err) => {
      if (err) {
        return res.json({
          success: false,
          message: "error save you like to database",
        });
      }
      return res.json({
        success: true,
        message: "success",
        numofLike: result.likeList.length,
      });
    });
  });
});

router.post("/postMoment", (req, res) => {
  let postMoment = new Post();
  let postCookieTime = new Date().getTime() + 24 * 60 * 60 * 1000;

  if (
    req.session.postCookie == null ||
    req.session.postCookie <= new Date().getTime()
  ) {
    req.session.postCookie = postCookieTime;
    req.session.postLeft = 3;
  }

  postMoment.nickname = req.body.nickname;
  postMoment.userId = req.body.userId;
  postMoment.postmessage = req.body.postmessage;
  postMoment.postDate = req.body.currentDate;
  postMoment.postTime = req.body.postTime;
  postMoment.likeList = [];
  postMoment.commentList = [];
  postMoment.hashtagList =
    req.body.hashtagList != null ? req.body.hashtagList : [];
  postMoment.userLogo = req.body.userLogo;
  postMoment.uniqueID = req.body.uniqueID;
  postMoment.fileLocation = req.body.fileLocation;
  postMoment.objectKey = req.body.fileKey;
  postMoment.reportCount = 0;
  postMoment.visible = true;

  if (req.session.userId) {
    postMoment.save((err, newPost) => {
      if (err) {
        // console.log(err);
        return res.json({ success: false, message: "Post moment failed" });
      } else {
        return res.json({
          success: true,
          message: "Post moment success!",
          postId: newPost._id,
        });
      }
    });
  } else if (req.session.postLeft == 0) {
    return res.json({
      success: false,
      message:
        "You have reached the max number of posts per day as anonymous, please login or sign up to post more!",
    });
  } else {
    req.session.postLeft--;
    postMoment.save((err, newPost) => {
      if (err) {
        // console.log(err);
        return res.json({ success: false, message: "Post moment failed" });
      } else {
        return res.json({
          success: true,
          message: "",
          postId: newPost._id,
        });
      }
    });
  }
});

module.exports = router;
