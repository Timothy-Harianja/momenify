const express = require("express");
const router = express.Router();
const Post = require("../postMoment");
const Hashtag = require("../hashtag");
router.post("/postHashtag", (req, res) => {
  for (let i = 0; i < req.body.hashtagList.length; i++) {
    Hashtag.findOne({ hashtag: req.body.hashtagList[i] }, (err, result) => {
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
        hashtag.hashtag = req.body.hashtagList[i];
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

router.post("/postMoment", (req, res) => {
  let postMoment = new Post();
  let postCookieTime = new Date().getTime() + 12 * 60 * 60 * 1000;

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
        "You have reached the max number of posts per day as anonymous, please login to post more!",
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
          message:
            "Post moment success! You have " +
            req.session.postLeft +
            " left for today! Login to make unlimited post per day!",
          postId: newPost._id,
        });
      }
    });
  }
});

module.exports = router;
