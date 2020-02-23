const express = require("express");
const User = require("../user");
const router = express.Router();

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

router.post("/active", (req, res) => {
  let tokenLink = req.headers.referer;
  token = getToken(tokenLink);
  console.log("url: ", token);
});

module.exports = router;
