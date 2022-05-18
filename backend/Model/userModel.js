const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    pic: {
      type: "String",
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      default: "online",
    },
  },
  { minimize: false }
);
userSchema.methods.getResetPasswordToken = function () {
  //! tạo mã thông báo
  const resetToken = crypto.randomBytes(20).toString("hex");

  //! Thêm resetPasswordToken vào userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};
module.exports = mongoose.model("Users", userSchema);
