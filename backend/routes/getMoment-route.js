const express = require("express");
const router = express.Router();
const Post = require("../postMoment");

function makeTime() {
  return new Date().getTime();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

router.get("/getMoment", (req, res) => {
  let day = 1000 * 60 * 60 * 24;

  Post.find({ postDate: { $gte: makeTime() - day } }, function(err, moments) {
    if (err) {
      // console.log(err);
    }
    let momentsList = [];
    let usernameList = [];
    let postidList = [];
    let numofLike = [];
    // console.log("like list", moments[0]);
    for (let i = 0; i < moments.length; i++) {
      momentsList.push(moments[i].postmessage);
      usernameList.push(moments[i].nickname);
      postidList.push(moments[i]._id);
      numofLike.push(moments[i].likeList.length);
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
    }

    // console.log("all moments: ", momentsList);
    // console.log("all username: ", usernameList);

    return res.json({
      allMoments: momentsList,
      allUsername: usernameList,
      allPostid: postidList,
      numofLike: numofLike,
      momentLength: moments.length
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
        message: "you already liked this post"
      });
    }
    result.likeList.push(req.session.userId);
    result.save(err => {
      if (err) {
        return res.json({
          success: false,
          message: "error save you like to database"
        });
      }
      return res.json({
        success: true,
        message: "success",
        numofLike: result.likeList.length
      });
    });
  });
});

module.exports = router;
