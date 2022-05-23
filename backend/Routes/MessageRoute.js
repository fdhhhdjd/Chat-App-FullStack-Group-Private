const messageCtrl = require("../Controllers/MessageController");
const router = require("express").Router();
const Auth = require("../middleware/Auth");
//Get All Message
router.get("/:chatId", Auth, messageCtrl.AllMessages);
//Send Message
router.post("/send", Auth, messageCtrl.SendMessage);

module.exports = router;
