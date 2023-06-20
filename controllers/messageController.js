const messageModel=require('../models/messageModels')

module.exports.addMessage=async(req,res,next)=>{
try{
    const {from,to,message} =req.body;
    const data=await messageModel.create({
        message:{text:message},
        users:[from,to],
        sender:from,
    })
    .then((res)=>console.log(res))
    .catch((err)=>console.error(err))
    if(data) return res.json({msg:"Message added successfully"});
    return res.json({msg:"Failed to add message to database"});    
}
catch(ex){
    next(ex)
}
}

module.exports.getMessage=async(req,res,next)=>{
try{
    const{ from,to }=req.body;
    const messages= await messageModel.find({
        users:{
            $all:[from,to],
        },
    })
    .sort({updatedAt:1});
    const projectMessages=messages.map((msg)=>{
        return{
            fromSelf:msg.sender.toString()===from,
            message:msg.message.text,
        };
    });
    return res.json(projectMessages);
}
catch(Ex){
    next(Ex);
}
}