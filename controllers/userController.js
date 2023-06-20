const User=require('../models/userModel');
const bcrypt=require('bcrypt')

module.exports.register= async (req,res,next)=>{
    try{
        const {username,email,password}=req.body;
        const usernameCheck= await User.findOne({username});
        if(usernameCheck){
            return res.json({msg:"username already exists", status:false})
        }
        const emailCheck= await User.findOne({email});
        if(emailCheck) return res.json({msg:"email already exists", status:false});
        const hashedpassword=await bcrypt.hash(password,10);
        const user=await User.create({
            email,
            username,
            password:hashedpassword,
        });
        return res.json({status:true, user});
       }
       catch(ex){
        next(ex);
       }
};

module.exports.login= async (req,res,next)=>{
    try{
        const {username,password}=req.body;
        const usercheck= await User.findOne({username});
        if(!usercheck){
            return res.json({msg:"incorrect username or password", status:false})
        }
        const ispasswordvalid=await bcrypt.compare(password,usercheck.password);
        if(!ispasswordvalid) return res.json({msg:"incorrect username or password", status:false});
        delete usercheck.password;
        return res.json({status:true, user:usercheck});
       }
       catch(ex){
        next(ex);
       }
};

module.exports.setAvatar=async(req,res,next)=>{
    try{
        const userId=req.params.id;
        const avatarImage=req.body.image;
        const userData=await User.findByIdAndUpdate(userId,{
            isAvatarImageSet:true,
            avatarImage,
        });
        return res.json({
            isSet:userData.isAvatarImageSet,
            image:userData.avatarImage,
        });

    }
    catch(ex){
        next(ex);
    }
}

module.exports.getAllUsers=async(req,res,next)=>{
    try{
        const users=await User.find({_id:{$ne : req.params.id}}).select([
            "email",
            "username",
            "avatarImage",
            "id",
        ])
        console.log(users);
        return res.json(users)
    }
    catch(ex){
        next(ex);
    }
}