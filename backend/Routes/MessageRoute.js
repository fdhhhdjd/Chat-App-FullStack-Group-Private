const messageCtrl = require("../Controllers/MessageController");
const router = require("express").Router();
const Auth = require("../middleware/Auth");
//Get All Message
router.get("/:chatId", Auth, messageCtrl.AllMessages);
//Send Message
router.post("/send", Auth, messageCtrl.SendMessage);
// Icon Message
router.post("/icon/:id", Auth, messageCtrl.UpDateIcon);

module.exports = router;
