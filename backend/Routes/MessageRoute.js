const messageCtrl = require("../Controllers/MessageController");
const router = require("express").Router();
const Auth = require("../middleware/Auth");
//Get All Message
router.post("/:chatId", Auth, messageCtrl.AllMessages);
//Send Message
router.post("/send", Auth, messageCtrl.AllMessages);

module.exports = router;
