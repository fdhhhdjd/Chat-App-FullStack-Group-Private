const jwt = require("jsonwebtoken");
const Users = require("../Model/userModel.js");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token)
      return res.status(400).json({
        status: 400,
        msg: "Invalid Authentication",
      });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      if (err)
        return res.status(400).json({
          status: 400,
          msg: "Invalid Authentication",
        });
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = await Users.findById(decoded.id).select("-password");
      next();
    });
  } catch (err) {
    return res.status(400).json({
      status: 400,
      msg: err.message,
    });
  }
};

module.exports = auth;
