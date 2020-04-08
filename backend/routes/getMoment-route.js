const express = require("express");
const router = express.Router();
const Post = require("../postMoment");
const Hashtag = require("../hashtag");
function makeTime() {
  return new Date().getTime();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

router.get("/getHashtag", (req, res) => {
  let days = 1000 * 60 * 60 * 24 * 10;
  Hashtag.find({ hashtagTime: { $gte: makeTime() - days } }, (err, result) => {
    if (err) {
      console.log(err);
      return res.json({
        success: false,
        message: "error posting the hashtag",
      });
    }
    let hashtagList = [];
    for (let i = result.length - 1; i >= 0; i--) {
      hashtagList.push(result[i].hashtag);
      if (hashtagList.length == 5) break;
    }
    return res.json({
      success: true,
      message: "retrived hashtag completed!",
      hashtagList: hashtagList,
    });
  }).sort("count");
});

router.get("/getMoment", (req, res) => {
  let day = 1000 * 60 * 60 * 24 * 7;

  Post.find({ postDate: { $gte: makeTime() - day } }, function (err, moments) {
    if (err) {
      console.log(err);
      return res.json({
        success: false,
        message: "error posting the hashtag",
      });
    }
    let momentsList = [];
    let usernameList = [];
    let postidList = [];
    let numofLike = [];
    let logoList = [];
    let commentList = [];
    let postDateList = [];
    let hashtagList = [];
    for (let i = 0; i < moments.length; i++) {
      momentsList.push(moments[i].postmessage);
      usernameList.push(moments[i].nickname);
      postidList.push(moments[i]._id);
      numofLike.push(moments[i].likeList.length);
      commentList.push(moments[i].commentList);
      postDateList.push(moments[i].postTime);
      hashtagList.push(moments[i].hashtagList);
      if (moments[i].nickname == null) {
        logoList.push("0");
      } else {
        logoList.push(moments[i].userLogo);
      }
    }

    // random the moment order
    for (let j = 0; j < moments.length; j++) {
      let pos1 = getRandomInt(momentsList.length);
      let pos2 = getRandomInt(momentsList.length);

      let temp = momentsList[pos1];
      momentsList[pos1] = momentsList[pos2];
      momentsList[pos2] = temp;

      let temp2 = usernameList[pos1];
      usernameList[pos1] = usernameList[pos2];
      usernameList[pos2] = temp2;

      let temp3 = postidList[pos1];
      postidList[pos1] = postidList[pos2];
      postidList[pos2] = temp3;

      let temp4 = numofLike[pos1];
      numofLike[pos1] = numofLike[pos2];
      numofLike[pos2] = temp4;

      let temp5 = logoList[pos1];
      logoList[pos1] = logoList[pos2];
      logoList[pos2] = temp5;

      let temp6 = commentList[pos1];
      commentList[pos1] = commentList[pos2];
      commentList[pos2] = temp6;

      let temp7 = postDateList[pos1];
      postDateList[pos1] = postDateList[pos2];
      postDateList[pos2] = temp7;

      let temp8 = hashtagList[pos1];
      hashtagList[pos1] = hashtagList[pos2];
      hashtagList[pos2] = temp8;
    }

    return res.json({
      allMoments: momentsList,
      allUsername: usernameList,
      allPostid: postidList,
      numofLike: numofLike,
      momentLength: moments.length,
      logoList: logoList,
      commentList: commentList,
      postDateList: postDateList,
      hashtagList: hashtagList,
    });
  });
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
    let messageWithName = req.session.username + ":  " + req.body.postComment;
    result.commentList.push(messageWithName);
    result.save((err) => {
      if (err) {
        return res.json({
          success: false,
          message: "error save you like to database",
        });
      }
      return res.json({
        success: true,
        message: messageWithName,
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

module.exports = router;