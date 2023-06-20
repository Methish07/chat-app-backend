
const router=require('express').Router();
const {addMessage,getMessage} =require('../controllers/messageController')

router.post("/addmsg",addMessage);
router.post("/getmsg",getMessage);

module.exports=router;