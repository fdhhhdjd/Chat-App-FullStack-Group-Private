const jwt = require("jsonwebtoken");
module.exports = {
  randomString(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },
  createAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });
  },
  createRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
  },
  detetedFileType(content_type) {
    const images = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const videos = [
      "video/mp4",
      "video/3gp",
      "video/ogg",
      "video/x-msvideo",
      "video/quicktime",
    ];
    const documents = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const audio = ["audio/aac", "audio/mpeg", "audio/ogg", "audio/wav"];

    if (images.includes(content_type)) {
      return "image";
    }

    if (videos.includes(content_type)) {
      return "video";
    }

    if (documents.includes(content_type)) {
      return "document";
    }

    if (audio.includes(content_type)) {
      return "audio";
    }
    return null;
  },
  UploadImage(file, removeTmp) {
    if (file.size > 1024 * 1024) {
      removeTmp(file.tempFilePath);
      let size = "Size too large";
      return size;
    }
    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
      removeTmp(file.tempFilePath);
      let mimetype = "File format is incorrect.";
      return mimetype;
    }
    return true;
  },
  UploadVideo(file, removeTmp) {
    return true;
  },
};
