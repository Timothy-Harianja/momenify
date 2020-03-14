const express = require("express");
const router = express.Router();
const Post = require("../postMoment");

router.get("/getMoment", (req, res) => {
  Post.find({}, function(err, moments) {
    let momentsList = [];
    let usernameList = [];
    for (let i = 0; i < moments.length; i++) {
      momentsList.push(moments[i].postmessage);
    }
    for (let i = 0; i < moments.length; i++) {
      usernameList.push(moments[i].nickname);
    }
    // console.log("all moments: ", momentsList);

    return res.json({ allMoments: momentsList, allUsername: usernameList });
  });
});

module.exports = router;
