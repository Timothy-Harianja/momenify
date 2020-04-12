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
    Post.findOne({ _id: hashtag }, (err, moments) => {
      if (err) reject(err);
      resolve(moments);
    });
  });
};

let getAllTag = (hashtags) => {
  let res = new Array(hashtags[0].postList.length);
  for (let i = 0; i < hashtags[0].postList.length; i++) {
    res[i] = new Promise((resolve, reject) => {
      getTag(hashtags[0].postList[i]).then((data) => {
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
  Post.find({ userId: token }, (err, posts) => {
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
      });
    } else {
      for (let i = 0; i < posts.length; i++) {
        momentsList.push(posts[i].postmessage);
        usernameList.push(posts[i].nickname == null ? null : posts[i].nickname);
        idList.push(posts[i].userId);
        postidList.push(posts[i]._id);
        numofLike.push(posts[i].likeList.length);
        logoList.push(posts[i].nickname == null ? 0 : posts[i].userLogo);
        commentList.push(posts[i].commentList);
        postDateList.push(posts[i].postTime);
        hashtagList.push(posts[i].hashtagList);
      }
      return res.json({
        idList: idList,
        allMoments: momentsList,
        allUsername: usernameList,
        allPostid: postidList,
        numofLike: numofLike,
        momentLength: posts.length,
        logoList: logoList,
        commentList: commentList,
        postDateList: postDateList,
        hashtagList: hashtagList,
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
    if (hashtags == null || hashtags.length == 0) {
      return res.json({
        hashtagName: "#" + token.toLowerCase(),
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
      });
    } else {
      getAllTag(hashtags).then((result) => {
        for (let i = 0; i < result.length; i++) {
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
    let idList = [];
    let momentsList = [];
    let usernameList = [];
    let postidList = [];
    let numofLike = [];
    let logoList = [];
    let commentList = [];
    let postDateList = [];
    let hashtagList = [];
    for (let i = 0; i < moments.length; i++) {
      idList.push(moments[i].userId);
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

      let temp9 = idList[pos1];
      idList[pos1] = idList[pos2];
      idList[pos2] = temp9;
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
    });
  });
});

module.exports = router;
