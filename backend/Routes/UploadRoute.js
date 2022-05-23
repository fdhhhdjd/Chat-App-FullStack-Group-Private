const uploadCtrl = require("../Controllers/UploadController");
const router = require("express").Router();
//Get All Message
router.post("/uploadImg", uploadCtrl.UploadImgCloud);
//Send Message
router.post("/destroyImg", uploadCtrl.DesTroyImg);

module.exports = router;
