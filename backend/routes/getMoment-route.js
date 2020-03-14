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
    if (err) console.log(err);
    let momentsList = [];
    let usernameList = [];
    for (let i = 0; i < moments.length; i++) {
      momentsList.push(moments[i].postmessage);
      usernameList.push(moments[i].nickname);
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
    }

    // console.log("all moments: ", momentsList);
    // console.log("all username: ", usernameList);

    return res.json({ allMoments: momentsList, allUsername: usernameList });
  });
});

module.exports = router;
