const Users = require("../Model/userModel");
const bcrypt = require("bcrypt");
const PASSWORD = require("../utils/password");
const HELPER = require("../utils/helper");
const userCtrl = {
  register: async (req, res, next) => {
    try {
      const { name, email, password, pic } = req.body;
      if (!password || !email || !name || !pic)
        return res.json({
          status: 400,
          success: false,
          msg: "Data are not empty.",
        });
      if (password.length < 6)
        return res.json({
          status: 400,
          success: false,
          msg: "Password is at least 6 characters long.",
        });
      const user = await Users.findOne({ email });
      if (user)
        return res.json({
          status: 400,
          success: false,
          msg: "The email already exists.",
        });

      if (password.length < 6)
        return res.json({
          status: 400,
          success: false,
          msg: "Password is at least 6 characters long.",
        });

      const passwordHash = await PASSWORD.encodePassword(password);
      const newUser = new Users({
        name,
        email,
        password: passwordHash,
        pic,
      });
      await newUser.save();
      let StringKey = HELPER.randomString(80);
      const accesstoken = HELPER.createAccessToken({
        id: newUser._id,
        name,
        StringKey,
      });
      const refreshtoken = HELPER.createRefreshToken({
        id: newUser._id,
        StringKey,
      });
      res.status(200).json({
        status: 200,
        success: true,
        accesstoken,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  Login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      if (!user)
        return res.json({
          status: 400,
          msg: "Email không tồn tại ! ",
        });
      const isPasswordValid = await bcrypt.compare(password, user.password);
      await PASSWORD.comparePassword(password, user.password).then(
        async (item) => {
          let StringKey = HELPER.randomString(80);
          const accesstoken = HELPER.createAccessToken({
            id: user._id,
            StringKey,
          });
          const refreshtoken = HELPER.createRefreshToken({
            id: user._id,
            StringKey,
          });
          if (item) {
            user.status = "online";
            await user.save();
            delete user.password;
            res.status(200).json({
              status: 200,
              success: true,
              accesstoken,
              user,
            });
          } else {
            return res.json({
              status: 400,
              msg: "Mật khẩu không đúng !",
              user,
            });
          }
        }
      );
    } catch (ex) {
      next(ex);
    }
  },
  SearchUser: async (req, res, next) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await Users.find(keyword).find({
      _id: { $ne: req.user._id },
    });

    res.status(200).json({
      status: 200,
      users,
    });
  },
};
module.exports = userCtrl;
