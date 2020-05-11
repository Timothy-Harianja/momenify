const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../postMoment");
const Hashtag = require("../hashtag");
const User = require("../user");
function makeTime() {
  return new Date().getTime();
}

function getToken(res) {
  let s = "";
  for (let i = res.length; i >= 0; i--) {
    if (res.charAt(i) != "/") {
      s = res.charAt(i) + s;
    } else {
      return s;
    }
  }
}

let getTag = (hashtag) => {
  return new Promise((resolve, reject) => {
    Post.findOne({ _id: hashtag, visible: true }, (err, moments) => {
      if (err) reject(err);
      resolve(moments);
    });
  });
};

let getAllTag = (hashtags) => {
  let res = new Array(hashtags[0].postList.length);
  let allHashtags = hashtags[0].postList;
  allHashtags = allHashtags.reverse();
  for (let i = 0; i < allHashtags.length; i++) {
    res[i] = new Promise((resolve, reject) => {
      getTag(allHashtags[i]).then((data) => {
        resolve(data);
      });
    });
  }
  return Promise.all(res);
};

router.get("/profilePage", (req, res) => {
  let tokenLink = req.headers.referer;
  token = getToken(tokenLink);

  let idList = [];
  let momentsList = [];
  let usernameList = [];
  let postidList = [];
  let numofLike = [];
  let logoList = [];
  let commentList = [];
  let postDateList = [];
  let hashtagList = [];
  let filesList = [];
  let visibleList = [];

  Post.find({ uniqueID: token }, (err, posts) => {
    if (err) {
      console.log(err);
      return res.json({
        success: false,
        message: "error posting the hashtag",
      });
    }
    if (posts == null || posts.length == 0) {
      User.findOne({ uniqueID: token }, (err, user) => {
        if (user == null) {
          return res.json({ message: "no user find", success: false });
        } else {
          return res.json({
            success: true,
            allMoments: [],
            followerCount: user.follower.length,
            followingCount: user.following.length,
            logoList: user.logo,
            allUsername: user.nickname,
          });
        }
      });
    } else {
      let newPosts = posts;
      if (req.session.uniqueID != token) {
        newPosts = [];
        for (let j = 0; j < posts.length; j++) {
          if (posts[j].visible == true) {
            newPosts.push(posts[j]);
          }
        }
      }
      getAllComments(newPosts).then((commentResult) => {
        commentList = commentResult;
        let followerCount = [];
        let followingCount = [];
        User.findOne({ uniqueID: token }, (err, userResult) => {
          if (err) console.log(err);
          followerCount = userResult.follower;
          followingCount = userResult.following;
          for (let i = 0; i < newPosts.length; i++) {
            momentsList.push(newPosts[i].postmessage);
            postidList.push(newPosts[i]._id);
            numofLike.push(newPosts[i].likeList.length);
            postDateList.push(newPosts[i].postTime);
            hashtagList.push(newPosts[i].hashtagList);
            filesList.push(newPosts[i].fileLocation);
            visibleList.push(newPosts[i].visible);
          }

          return res.json({
            success: true,
            ProfileUserId: newPosts[0].userId,
            allMoments: momentsList,
            allUsername: newPosts[0].nickname,
            allPostid: postidList,
            numofLike: numofLike,
            momentLength: newPosts.length,
            logoList: newPosts[0].userLogo,
            commentList: commentList,
            postDateList: postDateList,
            hashtagList: hashtagList,
            filesList: filesList,
            uniqueID: token,
            visibleList: visibleList,
            followerCount: followerCount.length,
            followingCount: followingCount.length,
          });
        });
      });
    }
  }).sort({ postDate: -1 });
});

router.get("/hashtagPage", (req, res) => {
  let tokenLink = req.headers.referer;
  token = getToken(tokenLink);

  Hashtag.find({ hashtag: "#" + token.toLowerCase() }, function (
    err,
    hashtags
  ) {
    if (err) {
      console.log(err);
      return res.json({
        success: false,
        message: "error posting the hashtag",
      });
    }
    let idList = [];
    let momentsList = [];
    let usernameList = [];
    let postidList = [];
    let numofLike = [];
    let logoList = [];
    let commentList = [];
    let postDateList = [];
    let hashtagList = [];
    let filesList = [];
    let uniqueID = [];
    if (hashtags == null || hashtags.length == 0) {
      return res.json({
        hashtagName: "#" + token.toLowerCase(),
        idList: idList,
        allMoments: momentsList,
        allUsername: usernameList,
        allPostid: postidList,
        numofLike: numofLike,
        momentLength: 0,
        uniqueID: uniqueID,
        logoList: logoList,
        commentList: commentList,
        postDateList: postDateList,
        hashtagList: hashtagList,
      });
    } else {
      getAllTag(hashtags).then((result) => {
        let finalResult = []; // removed the private post
        for (let j = 0; j < result.length; j++) {
          if (result[j] != null) {
            finalResult.push(result[j]);
          }
        }
        getAllComments(finalResult).then((commentResult) => {
          commentList = commentResult;
          for (let i = 0; i < finalResult.length; i++) {
            if (finalResult[i] != null) {
              momentsList.push(finalResult[i].postmessage);
              usernameList.push(
                finalResult[i].nickname == null ? null : finalResult[i].nickname
              );
              idList.push(finalResult[i].userId);
              postidList.push(finalResult[i]._id);
              numofLike.push(finalResult[i].likeList.length);
              logoList.push(
                finalResult[i].nickname == null ? 0 : finalResult[i].userLogo
              );

              postDateList.push(finalResult[i].postTime);
              hashtagList.push(finalResult[i].hashtagList);
              filesList.push(finalResult[i].fileLocation);
              uniqueID.push(finalResult[i].uniqueID);
            }
          }

          return res.json({
            hashtagName: "#" + token.toLowerCase(),
            idList: idList,
            allMoments: momentsList,
            allUsername: usernameList,
            allPostid: postidList,
            numofLike: numofLike,
            momentLength: hashtags[0].postList.length,
            logoList: logoList,
            commentList: commentList,
            postDateList: postDateList,
            hashtagList: hashtagList,
            filesList: filesList,
            uniqueIDList: uniqueID,
          });
        });
      });
    }
  });
});

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

let comment = (obj) => {
  return new Promise((resolve, reject) => {
    User.findOne({ uniqueID: obj[0] }, (err, result) => {
      if (err) reject(err);
      // console.log("result from getUser: ", result);
      let currentDay = new Date();
      let timestamp = (currentDay - obj[2]) / (1000 * 3600 * 24);
      let dayPast = "";
      if (timestamp < 0.04166666666) {
        let delta = Math.abs(currentDay - obj[2]) / 1000;
        dayPast = (Math.floor(delta / 60) % 60) + "m";
      } else if (timestamp < 1) {
        let delta = Math.abs(currentDay - obj[2]) / 1000;
        dayPast = (Math.floor(delta / 3600) % 24) + "h";
      } else {
        let delta = Math.abs(currentDay - obj[2]) / 1000;
        dayPast = Math.floor(delta / 86400) + "d";
      }
      let userInfo = [
        result.uniqueID,
        obj[1],
        result.logo,
        result.nickname,
        dayPast,
      ];
      resolve(userInfo);
    });
  });
};

let getComments = (obj) => {
  // console.log("get user: ", user);
  let res = new Array(obj.length);
  // let commentList = obj.reverse();
  for (let i = 0; i < obj.length; i++) {
    res[i] = new Promise((resolve, reject) => {
      comment(obj[i]).then((data) => {
        resolve(data);
      });
    });
  }
  return Promise.all(res);
};

let getAllComments = (obj) => {
  // console.log("get all users: ", user.users.length);
  let res = new Array(obj.length);
  for (let i = 0; i < obj.length; i++) {
    res[i] = new Promise((resolve, reject) => {
      getComments(obj[i].commentList).then((data) => {
        resolve(data);
      });
    });
  }
  return Promise.all(res);
};

router.get("/getPeople", (req, res) => {
  let peopleList = [];
  User.aggregate([{ $sample: { size: 5 } }], (err, result) => {
    for (let i = 0; i < result.length; i++) {
      peopleList.push([result[i].nickname, result[i].uniqueID, result[i].logo]);
    }

    return res.json({ success: true, peopleList: peopleList });
  });
});

router.post("/getMoment", (req, res) => {
  let days = 1000 * 60 * 60 * 24 * 10;
  let visitedPost = req.body.visitedList;
  let type = ["image", "text", "video"];
  let filter = req.body.filter;
  let following = [];
  if (filter != null) {
    if (filter == "image" || filter == "video" || filter == "text") {
      type = [filter];
    } else if (filter == "today") {
      days = 1000 * 60 * 60 * 24;
    } else if (filter == "week") {
      days = 1000 * 60 * 60 * 24 * 7;
    } else if (filter == "month") {
      days = 1000 * 60 * 60 * 24 * 30;
    } else if (filter == "following") {
      following = req.body.following;
    }
  }

  if (filter == "following") {
    let following = [];
    User.findOne({ uniqueID: req.session.uniqueID }, (err, result) => {
      if (result != null) {
        following = result.following;
      }
      Post.aggregate(
        [
          {
            $match: {
              visible: true,
              fileType: { $in: type.map((i) => i) },
              userId: { $in: following.map((i) => i) },
              _id: {
                $nin: visitedPost.map((post) => mongoose.Types.ObjectId(post)),
              },
              postDate: {
                $gte: makeTime() - days,
              },
            },
          },
          { $sample: { size: 5 } },
        ],
        function (err, moments) {
          if (err) {
            console.log(err);
            return res.json({
              success: false,
              message: "error posting the hashtag",
            });
          }
          let idList = [];
          let momentsList = [];
          let usernameList = [];
          let postidList = [];
          let numofLike = [];
          let logoList = [];
          let commentList = [];
          let postDateList = [];
          let hashtagList = [];
          let filesList = [];
          let postTimeList = [];
          let uniqueIDList = [];
          let likestatus = [];
          getAllComments(moments).then((allComments) => {
            commentList = allComments;
            for (let i = 0; i < moments.length; i++) {
              if (moments[i].likeList.includes(req.session.userId)) {
                likestatus.push(true);
              } else {
                likestatus.push(false);
              }

              idList.push(moments[i].userId);
              momentsList.push(moments[i].postmessage);
              usernameList.push(moments[i].nickname);
              postidList.push(moments[i]._id);
              numofLike.push(moments[i].likeList.length);
              postDateList.push(moments[i].postTime);
              hashtagList.push(moments[i].hashtagList);
              filesList.push(moments[i].fileLocation);
              postTimeList.push(moments[i].postDate);
              uniqueIDList.push(moments[i].uniqueID);
              if (moments[i].nickname == null) {
                logoList.push("0");
              } else {
                logoList.push(moments[i].userLogo);
              }
            }
            return res.json({
              idList: idList,
              likestatus: likestatus,
              allMoments: momentsList,
              allUsername: usernameList,
              allPostid: postidList,
              numofLike: numofLike,
              momentLength: moments.length,
              logoList: logoList,
              commentList: commentList,
              postDateList: postDateList,
              hashtagList: hashtagList,
              filesList: filesList,
              postTimeList: postTimeList,
              uniqueIDList: uniqueIDList,
            });
          });
        }
      );
    });
  } else {
    Post.aggregate(
      [
        {
          $match: {
            visible: true,
            fileType: { $in: type.map((i) => i) },

            // userId: { $in: following.map((i) => i) },
            _id: {
              $nin: visitedPost.map((post) => mongoose.Types.ObjectId(post)),
            },
            postDate: {
              $gte: makeTime() - days,
            },
          },
        },

        { $sample: { size: 5 } },
      ],
      function (err, moments) {
        if (err) {
          console.log(err);
          return res.json({
            success: false,
            message: "error posting the hashtag",
          });
        }
        let idList = [];
        let momentsList = [];
        let usernameList = [];
        let postidList = [];
        let numofLike = [];
        let logoList = [];
        let commentList = [];
        let postDateList = [];
        let hashtagList = [];
        let filesList = [];
        let postTimeList = [];
        let uniqueIDList = [];
        let likestatus = [];
        getAllComments(moments).then((allComments) => {
          commentList = allComments;
          for (let i = 0; i < moments.length; i++) {
            if (moments[i].likeList.includes(req.session.userId)) {
              likestatus.push(true);
            } else {
              likestatus.push(false);
            }
            idList.push(moments[i].userId);
            momentsList.push(moments[i].postmessage);
            usernameList.push(moments[i].nickname);
            postidList.push(moments[i]._id);
            numofLike.push(moments[i].likeList.length);
            postDateList.push(moments[i].postTime);
            hashtagList.push(moments[i].hashtagList);
            filesList.push(moments[i].fileLocation);
            postTimeList.push(moments[i].postDate);
            uniqueIDList.push(moments[i].uniqueID);
            if (moments[i].nickname == null) {
              logoList.push("0");
            } else {
              logoList.push(moments[i].userLogo);
            }
          }
          return res.json({
            idList: idList,
            likestatus: likestatus,
            allMoments: momentsList,
            allUsername: usernameList,
            allPostid: postidList,
            numofLike: numofLike,
            momentLength: moments.length,
            logoList: logoList,
            commentList: commentList,
            postDateList: postDateList,
            hashtagList: hashtagList,
            filesList: filesList,
            postTimeList: postTimeList,
            uniqueIDList: uniqueIDList,
          });
        });
      }
    );
  }
});

module.exports = router;
