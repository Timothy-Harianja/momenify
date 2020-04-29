const express = require("express");
const User = require("../user");

const router = express.Router();

router.post("/follow", (req, res) => {
  console.log("backend: /follow");
  // console.log("req.body.userid: ", req.body.userid);
  console.log("req.session.userId is null?: ", req.session.userId == null);
  if (req.session.userId != null) {
    var yourId = req.session.userId;
    console.log("you login already");

    //check you cannot follow yourself
    if (yourId == req.body.userid) {
      console.log("you cannot follow yourself");
      return res.json({
        success: false,
        message: "you cannot follow yourself",
      });
    }
    //find user to follow in database
    User.findOne({ _id: req.body.userid }, (err, userToFollow) => {
      if (err) {
        console.log("err in find the user to be followed:", err);
        return res.json({
          success: false,
          message: "err in find the user to be followed",
        });
      }
      if (userToFollow.follower.includes(yourId)) {
        //if you followed already don't update
        console.log("you already followed this user", err);
        return res.json({
          success: false,
          message: "you already followed this user: " + userToFollow.nickname,
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
    console.log("you shold login first");
    return res.json({ success: false, message: "You need to login first" });
  }
});

router.post("/unfollow", (req, res) => {
  console.log("backend: /unfollow");
  console.log("req.session.userId is: ", req.session.userId);
  console.log("req.body.userid is : ", req.body.userid);
  if (req.session.userId != null) {
    var yourId = req.session.userId;
    console.log("you did login");
    //find user to unfollow in database
    User.findOne({ _id: req.body.userid }, (err, userFollowed) => {
      if (err) {
        console.log("err in find the user to be followed:", err);
        return res.json({
          success: false,
          message: "err in find the user to be followed",
        });
      }
      console.log("userFollowed.follower, ", userFollowed.follower);
      if (!userFollowed.follower.includes(yourId)) {
        //did not follow the user
        console.log("the follower didn't records you", err);
        return res.json({
          success: false,
          message: "the follower didn't records you: " + userFollowed.nickname,
        });
      }
      var userNickName = userFollowed.nickname;
      var updateFollower = userFollowed.follower;
      console.log("updateFollower before,  ", updateFollower);
      updateFollower = updateFollower.filter((item) => item != yourId);
      console.log("updateFollower after ,  ", updateFollower);

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
          console.log("updateFollowing before, ", updateFollowing);
          updateFollowing = updateFollowing.filter(
            (item) => item != req.body.userid
          );
          console.log("updateFollowing after, ", updateFollowing);

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
    console.log("you shold login first");
    return res.json({ success: false, message: "you shold login first" });
  }
});

module.exports = router;
