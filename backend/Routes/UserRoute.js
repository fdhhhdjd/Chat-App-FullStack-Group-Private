const userCtrl = require("../Controllers/userController");
const router = require("express").Router();
const Auth = require("../middleware/Auth");
//!User

//Register
router.post("/register", userCtrl.register);

//Login
router.post("/login", userCtrl.Login);

//Logout
router.post("/logout", userCtrl.Logout);

//Search
router.get("/", Auth, userCtrl.SearchUser);

module.exports = router;
