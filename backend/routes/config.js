const express = require("express");
const User = require("../user");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

const s3 = new aws.S3({
  accessKeyId: "AKIAJOTNL5MBC5VHYNTA",
  secretAccessKey: "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",
  Bucket: "momenify",
});

const profileImgUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "momenify",
    acl: "public-read",
    key: function (req, file, cb) {
      cb(
        null,
        path.basename(file.originalname, path.extname(file.originalname)) +
          "-" +
          Date.now() +
          path.extname(file.originalname)
      );
    },
  }),
  limits: { fileSize: 50 * 1000000 }, // In bytes: 1000000 bytes = 1 MB
}).single("myFiles");

router.post("/uploadLogo", (req, res) => {
  console.log("upload image called!");
  profileImgUpload(req, res, (error) => {
    console.log("requestOkokok", req.file);
    // console.log("error", error);
    if (error) {
      console.log("errors", error);
      return res.json({ success: false, message: "file too large" });
    } else {
      // If File not found
      if (req.file === undefined) {
        console.log("Error: No File Selected!");
        return res.json({ success: false });
      } else {
        // If Success
        // console.log("req.file: ", req.file);
        const imageLocation = req.file.location;
        // Save the file name into database into profile model
        return res.json({
          success: true,
          imageLocation: imageLocation,
        });
      }
    }
  });
});

router.post("/updateInfo", (req, res) => {
  let username = req.body.userNickname;
  let currentLogo = req.body.currentLogo;
  User.findOneAndUpdate(
    { _id: req.session.userId },
    { nickname: username, logo: currentLogo },
    (err) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, message: "Updated failed" });
      } else {
        return res.json({ success: true, message: "Updated!" });
      }
    }
  );
});
module.exports = router;
