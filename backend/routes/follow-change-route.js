const express = require("express");
const User = require("../user");

const router = express.Router();

router.post("/follow", (req, res) => {
  if (req.session.userId != null) {
    var yourId = req.session.userId;

    //check you cannot follow yourself
    if (yourId == req.body.userid) {
      return res.json({
        success: false,
        message: "you cannot follow yourself",
      });
    }
    User.findOne({ _id: req.body.userid }, (err, userToFollow) => {
      if (err) {
        return res.json({
          success: false,
          message: "err in find the user to be followed",
        });
      }
      if (userToFollow.follower.includes(yourId)) {
        //if you followed already don't update
        return res.json({
          success: false,
          message: "You already followed this user: " + userToFollow.nickname,
        });
      }
      var userNickName = userToFollow.nickname;
      updateFollower = userToFollow.follower;
      updateFollower.push(yourId);
      userToFollow.follower = updateFollower;
      userToFollow.save((err) => {
        if (err) {
          console.log("err in user to be followed", err);
          return res.json({
            success: false,
            message: "err in user to be followe",
          });
        }
        User.findOne({ _id: yourId }, (err, yours) => {
          if (err) {
            console.log("err in find your info", err);
            return res.json({
              success: false,
              message: "err in find your info",
            });
          }
          updateFollowing = yours.following;
          updateFollowing.push(req.body.userid);
          yours.following = updateFollowing;
          yours.save((err) => {
            if (err) {
              console.log("err in update your info", err);
              return res.json({
                success: false,
                message: "err in update your info",
              });
            }
            //now you and the other user are updated
            return res.json({
              success: true,
              message: "You followed " + userNickName,
            });
          });
        });
      });
    });
  } else {
    return res.json({ success: false, message: "You need to login first" });
  }
});

router.post("/unfollow", (req, res) => {
  if (req.session.userId != null) {
    var yourId = req.session.userId;
    //find user to unfollow in database
    User.findOne({ _id: req.body.userid }, (err, userFollowed) => {
      if (err) {
        console.log("err in find the user to be followed:", err);
        return res.json({
          success: false,
          message: "err in find the user to be followed",
        });
      }
      if (!userFollowed.follower.includes(yourId)) {
        //did not follow the user
        return res.json({
          success: false,
          message: "the follower didn't records you: " + userFollowed.nickname,
        });
      }
      var userNickName = userFollowed.nickname;
      var updateFollower = userFollowed.follower;
      updateFollower = updateFollower.filter((item) => item != yourId);
      userFollowed.follower = updateFollower;
      userFollowed.save((err) => {
        if (err) {
          console.log("err in user to be unfollowed", err);
          return res.json({
            success: false,
            message: "err in user to be unfollowed",
          });
        }
        User.findOne({ _id: yourId }, (err, yours) => {
          if (err) {
            console.log("err in find your info", err);
            return res.json({
              success: false,
              message: "err in find your info",
            });
          }
          var updateFollowing = yours.following;
          updateFollowing = updateFollowing.filter(
            (item) => item != req.body.userid
          );

          yours.following = updateFollowing;
          yours.save((err) => {
            if (err) {
              console.log("err in update your info", err);
              return res.json({
                success: false,
                message: "err in update your info",
              });
            }
            //now you and the other user are updated
            return res.json({
              success: true,
              message: "You unfollowed " + userNickName,
            });
          });
        });
      });
    });
  } else {
    return res.json({ success: false, message: "You should login first" });
  }
});

module.exports = router;
