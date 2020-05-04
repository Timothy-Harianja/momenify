const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../postMoment");
const Hashtag = require("../hashtag");
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
      for (let i = 0; i < posts.length; i++) {
        momentsList.push(posts[i].postmessage);
        // usernameList.push(posts[i].nickname == null ? null : posts[i].nickname);
        // idList.push(posts[i].userId);

        postidList.push(posts[i]._id);
        numofLike.push(posts[i].likeList.length);
        // logoList.push(posts[i].nickname == null ? 0 : posts[i].userLogo);
        commentList.push(posts[i].commentList);
        postDateList.push(posts[i].postTime);
        hashtagList.push(posts[i].hashtagList);
        filesList.push(posts[i].fileLocation);
        visibleList.push(posts[i].visible);
      }
      return res.json({
        ProfileUserId: posts[0].userId,
        allMoments: momentsList,
        allUsername: posts[0].nickname,
        allPostid: postidList,
        numofLike: numofLike,
        momentLength: posts.length,
        logoList: posts[0].userLogo,
        commentList: commentList,
        postDateList: postDateList,
        hashtagList: hashtagList,
        filesList: filesList,
        uniqueID: token,
        visibleList: visibleList,
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
        for (let i = 0; i < result.length; i++) {
          if (result[i] != null) {
            momentsList.push(result[i].postmessage);
            usernameList.push(
              result[i].nickname == null ? null : result[i].nickname
            );
            idList.push(result[i].userId);
            postidList.push(result[i]._id);
            numofLike.push(result[i].likeList.length);
            logoList.push(result[i].nickname == null ? 0 : result[i].userLogo);
            commentList.push(result[i].commentList);
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
      for (let i = 0; i < moments.length; i++) {
        idList.push(moments[i].userId);
        momentsList.push(moments[i].postmessage);
        usernameList.push(moments[i].nickname);
        postidList.push(moments[i]._id);
        numofLike.push(moments[i].likeList.length);
        commentList.push(moments[i].commentList);
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
    }
  );
});

module.exports = router;
