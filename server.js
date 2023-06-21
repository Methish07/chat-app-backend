const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const userRoutes=require('./routes/userRoutes');
const messageRoutes=require('./routes/messageRoutes');
require('dotenv').config();
const socket=require('socket.io');


var app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth',userRoutes);
app.use('/api/messages/',messageRoutes);


mongoose.connect(process.env.MONGO_URL,{
   useNewUrlParser:true,
   useUnifiedTopology: true
})
.then(()=>{
   console.log("DB connected Successfully");
})
.catch((err)=>{
   console.log(err.message);
})

const server=app.listen(process.env.PORT, ()=>{
   console.log("server is running at "+process.env.PORT);
});


const io=socket(server,{
   cors:{
      origin:"https://my-mern-chat.netlify.app",
      credentials:true,
   }
})

global.onlineUsers=new Map();

io.on("connection",(socket)=>{
   global.chatSocket-socket;

   socket.on("add-user",(userId)=>{
      onlineUsers.set(userId,socket.id);
   });

   socket.on("send-msg",(data)=>{
      const sendUserSocket=onlineUsers.get(data.to);
      if(sendUserSocket){
         socket.to(sendUserSocket).emit("msg-receive",data.message);

      }
   })
})
