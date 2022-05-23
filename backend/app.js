const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
app.enable("trust proxy");
const bodyParser = require("body-parser");
app.use(express.json());
app.use(cookieParser());
app.use(cors());
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
//!Middleware for error
module.exports = app;
