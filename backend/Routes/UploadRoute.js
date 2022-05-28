const uploadCtrl = require("../Controllers/UploadController");
const router = require("express").Router();
//Upload Image And Video
router.post("/uploadImg", uploadCtrl.UploadImgCloud);
//Upload Files
router.post("/files", uploadCtrl.UpLoadFilesCloud);
//Send Message
router.post("/destroyImg", uploadCtrl.DesTroyImg);

module.exports = router;
