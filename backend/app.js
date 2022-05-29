const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
const compression = require("compression");
app.enable("trust proxy");
const bodyParser = require("body-parser");
app.use(
  compression({
    level: 6,
    threshold: 100 * 1000,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }

      return compression.filter(req, res);
    },
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(cors());
// app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(
  express.json({
    verify: (req, res, buffer) => (req["rawBody"] = buffer),
  })
);

//!router import
const Users = require("./Routes/UserRoute.js");
const Groups = require("./Routes/ChatRoute.js");
const Messages = require("./Routes/MessageRoute.js");
const upload = require("./Routes/UploadRoute");
//!Link router Main
app.use("/api/auth", Users);
app.use("/api/group", Groups);
app.use("/api/message", Messages);
//!upload
app.use("/api/upload", upload);
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});
//!Middleware for error
module.exports = app;
