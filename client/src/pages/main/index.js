import { useEffect, useState } from "react"
import { useChatsStore, useUserStore } from "../../store"
import { ChatSection } from "./components/chatSection"
import {Loader} from "../../componetns/loader/Loader"
import socket from "../../socket"
import './IndexCss.css'

export const Main=()=>{
    const {user}=useUserStore()
    const {addChat}=useChatsStore()
    const [queue,setQueue]=useState([])

    useEffect(()=>{
        socket.on('add-user-to-queue',(user,userSocketId)=>{
            console.log('add-user-to-queue:',user)
            setQueue(prev=>[...prev,{...user,userSocketId}])
        })
        return ()=> {socket.off('add-user-to-queue')}
    },[])

    const createChatHandler=(userId,userSocketId)=>{
        const id=Date.now()
        socket.emit('create-chat',{
            id:id,
            userId:userId,
            adminId:user.id,
            userSocketId:userSocketId
        })
        addChat({
            id:id,
            userId:userId,
            adminId:user.id
        })
        setQueue(
            queue.filter((p)=>{
                if(p.id!=userId) return p
            })
        )
    }


    return(

        <div>
            <p style={{textAlign:'center'}}>Main</p>
            {user.isAdmin
            ?
                <div style={{maxWidth:'500px'}}>
                    {queue.map((p)=>
                        <div className="div-start-chat">
                            <p className="user-start-chat">
                                {p.username + " want to talk with you"}
                            </p> 
                            <button onClick={()=>createChatHandler(p.id,p.userSocketId)} className="button-start-chat">
                            start chat
                            </button>   
                        </div>
                    )}
                </div>
            :
                    <></>
            }
            <div className="chat-placeholder">
                <ChatSection />
            </div>
        </div>
    )
}