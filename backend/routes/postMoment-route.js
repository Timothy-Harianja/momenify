const express = require("express");
const router = express.Router();
const Post = require("../postMoment");

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
  postMoment.likeList = [];

  if (req.session.userId) {
    postMoment.save((err, newPost) => {
      if (err) {
        // console.log(err);
        return res.json({ success: false, message: "Post moment failed" });
      } else {
        return res.json({
          success: true,
          message: "Post moment success!",
          postId: newPost._id
        });
      }
    });
  } else if (req.session.postLeft == 0) {
    return res.json({
      success: false,
      message:
        "You have reached the max number of posts per day as anonymous, please login to post more!"
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
            " left for today!",
          postId: newPost._id
        });
      }
    });
  }
});

module.exports = router;
