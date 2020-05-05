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
      return res.json({
        idList: idList,
        allMoments: momentsList,
        allUsername: usernameList,
        allPostid: postidList,
        numofLike: numofLike,
        momentLength: 0,
        logoList: logoList,
        commentList: commentList,
        postDateList: postDateList,
        hashtagList: hashtagList,
        filesList: filesList,
        visibleList: visibleList,
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
      getAllComments(posts).then((commentResult) => {
        commentList = commentResult;
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
        });
      });
    }
  });
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
        getAllComments(result).then((commentResult) => {
          commentList = commentResult;
          for (let i = 0; i < result.length; i++) {
            if (result[i] != null) {
              momentsList.push(result[i].postmessage);
              usernameList.push(
                result[i].nickname == null ? null : result[i].nickname
              );
              idList.push(result[i].userId);
              postidList.push(result[i]._id);
              numofLike.push(result[i].likeList.length);
              logoList.push(
                result[i].nickname == null ? 0 : result[i].userLogo
              );

              postDateList.push(result[i].postTime);
              hashtagList.push(result[i].hashtagList);
              filesList.push(result[i].fileLocation);
              uniqueID.push(result[i].uniqueID);
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
  let commentList = obj.reverse();
  for (let i = 0; i < commentList.length; i++) {
    res[i] = new Promise((resolve, reject) => {
      comment(commentList[i]).then((data) => {
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

router.post("/getMoment", (req, res) => {
  let days = 1000 * 60 * 60 * 24 * 7;
  let visitedPost = req.body.visitedList;

  Post.aggregate(
    [
      {
        $match: {
          visible: true,
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

      getAllComments(moments).then((allComments) => {
        commentList = allComments;
        for (let i = 0; i < moments.length; i++) {
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

module.exports = router;
