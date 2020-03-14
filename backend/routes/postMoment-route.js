const express = require("express");
const router = express.Router();
const Post = require("../postMoment");

router.post("/postMoment", (req, res) => {
  let postMoment = new Post();
  postMoment.nickname = req.body.nickname;
  postMoment.userId = req.body.userId;
  postMoment.postmessage = req.body.postmessage;
  postMoment.postDate = req.body.currentDate;
  postMoment.save(err => {
    if (err) {
      console.log(err);
      return res.json({ success: false, message: "Post moment failed" });
    } else {
      return res.json({ success: true, message: "Post moment success!" });
    }
  });
});

module.exports = router;
