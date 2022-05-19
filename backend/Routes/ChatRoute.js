const chatCtrl = require("../Controllers/chatController");
const router = require("express").Router();
const Auth = require("../middleware/Auth");
//Create Group
router.post("/create", Auth, chatCtrl.CreateGroupChat);

//Rename Group
router.put("/rename", Auth, chatCtrl.RenameFromGroup);

//Add To Group
router.put("/groupadd", Auth, chatCtrl.AddToGroup);

//Remove From Group
router.put("/groupremove", Auth, chatCtrl.RemoveFromGroup);

//Fetch Chat
router.get("/fetch", Auth, chatCtrl.fetchChats);

//Access user to Group
router.post("/access", Auth, chatCtrl.accessChat);

module.exports = router;
