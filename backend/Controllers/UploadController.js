const cloudinary = require("cloudinary");
require("dotenv").config();
const detectMime = require("mime");
const HELPER = require("../utils/helper");
const CONSTANTS = require("../configs/constants");
const fs = require("fs");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
console.log(process.env.CLOUD_NAME, "cloudinary connect");
const UploadCtrl = {
  // Upload image
  UploadImgCloud: async (req, res, next) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0)
        return res.status(400).json({ msg: "No files were uploaded." });
      const file = req.files.file;
      const mime_type = detectMime.getExtension(file.mimetype);
      const mime_type1 = detectMime.getType(mime_type);
      const system_file_type = HELPER.detetedFileType(mime_type1);
      let template_upload;
      let cloud_bucket;
      switch (system_file_type) {
        case "video":
          template_upload = HELPER.UploadVideo(file, removeTmp);
          cloud_bucket = CONSTANTS.S3_BUCKET_VIDEOS;
          break;
        case "image":
          template_upload = HELPER.UploadImage(file, removeTmp);
          cloud_bucket = CONSTANTS.S3_BUCKET_IMAGES;
          break;
      }
      if (template_upload !== true) {
        return res.json({
          status: 400,
          msg: template_upload,
        });
      } else if (template_upload === true) {
        if (cloud_bucket == "image") {
          cloudinary.v2.uploader.upload(
            file.tempFilePath,
            { folder: "imageChat" },
            async (err, result) => {
              if (err) throw err;
              removeTmp(file.tempFilePath);
              res.json({
                public_id: result.public_id,
                url: result.secure_url,
              });
            }
          );
        } else if (cloud_bucket == "video") {
          cloudinary.v2.uploader.upload_large(
            file.tempFilePath,
            {
              folder: "chat/video",
              resource_type: "video",
              chunk_size: 6000000,
            },
            async (err, result) => {
              if (err) throw err;
              removeTmp(file.tempFilePath);
              res.json({ public_id: result.public_id, url: result.secure_url });
            }
          );
        }
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  // Delete image
  DesTroyImg: async (req, res, next) => {
    try {
      const { public_id } = req.body;
      if (!public_id)
        return res.status(400).json({ msg: "No images Selected" });

      cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
        if (err) throw err;

        res.json({ msg: "Deleted Image" });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};
module.exports = UploadCtrl;
