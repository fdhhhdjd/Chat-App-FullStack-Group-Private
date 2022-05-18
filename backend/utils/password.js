const bcrypt = require("bcrypt");
const CONSTAINTS = require("../configs/constants");
const JwtLib = require("jsonwebtoken");

module.exports = {
  encodePassword: (password_text) => {
    return bcrypt.hash(password_text, CONSTAINTS.SALT_ROUNDS);
  },

  comparePassword: (password_text, password_hash) => {
    return bcrypt.compare(password_text, password_hash);
  },

  getJWT: (user, exp_time = CONSTAINTS._1_DAY_S) => {
    // for testing, exp time set to unlimit, remove later
    exp_time = 99999999;

    if (user && user.id && user.role && user.full_name) {
      let claim = {
        sub: user.id,
        user_id: user.id,
        name: user.full_name,
        role: user.role,
        iat: Math.round(new Date().getTime() / 1000) - CONSTAINTS._1_HOURS_S, //dat note: -1 hours, work around for bug JWTIssuedAtFuture
        exp: Math.round(new Date().getTime() / 1000) + exp_time,
      };

      return JwtLib.sign(claim, CONFIG.JWT_KEY);
    } else {
      return false;
    }
  },

  decodeJWT(token) {
    return JwtLib.decode(token, CONFIG.JWT_KEY);
  },
};
