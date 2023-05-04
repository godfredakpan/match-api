const { addMessage, getMessages, getAllMessages, deleteAll } = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.get("/getAllMessages/", getAllMessages);
router.delete("/delete/messages", deleteAll);

module.exports = router;
