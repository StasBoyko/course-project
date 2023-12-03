import { Server } from "socket.io";
import dotenv from 'dotenv/config'
import cors from 'cors'

const PORT=process.env.PORT||5050
const io = new Server(PORT,{cors: {
    origin: "*",
}});


io.on("connection", (socket) => {
  var socketID=socket.id
  console.log(socketID)

  socket.emit('userConnected',{socketID})

  socket.on('sendMsg',(id,userId,text,chatId)=>{   // args of message
      if(!chatId){
        //console.log('msg func 1')
        /*socket.broadcast.emit('getMsg',{
          id,
          userId,
          chatId,
          text
        })*/
      }else{
        socket.to(chatId).emit('getMsg',{  // socket.to(chatId) sends message in current room of socket, so if some user connected to same room, he will reciev this message
          id,
          userId,
          chatId,
          text
        })
      }
    });

  socket.on('joinRoom',(room)=>{
      socket.join(room)
      io.to(socket.id).emit('activeRoom',room)
  })
    
  socket.on('add-user-to-queue',(user,userSocketId)=>{ 
    socket.to('admin').emit('add-user-to-queue',user,userSocketId)
  })

  socket.on('create-chat',(chat)=>{
    io.to(chat.userSocketId).emit('create-chat',chat)
  })

  socket.on('join-admin-room',()=>{
    socket.join('admin')
  })

});



