import {useEffect, useState} from 'react'
import './chatSection.css'
import messagesApi from '../../../../api/messagesApi'
import { useChatsStore, useMessagesStore, useUserStore } from '../../../../store'
import { ChatIcon } from './chatIcon'
import { MessagesList } from './messagesList'
import { MessageInput } from './MessageInput'
import { io } from 'socket.io-client'
import chatsApi from '../../../../api/chatsApi'
//import chatsApi from '../../../../api/chatsApi'
import socket from '../../../../socket'
import { JoinQueue } from './JoinQueue'
import { Loader } from '../../../../componetns/loader/Loader'



export const ChatSection=()=>{
    const massagesForTitle = ["you need to apply for correspondence", "The admin has approved your application, you can chat"];

    const {user}=useUserStore()
    const {messages,addMessage}=useMessagesStore()
    const {chats,addChat}=useChatsStore()
    const [isChatLoading, setIsChatLoading]=useState(false)
    const [isChatLoadingTitle, setIsChatLoadingTitle]=useState(true)
    const [isChatExists,setIsChatExists]=useState(false)
    const [activeChatId,setActiveChatId]=useState(0)
    const [sortedMessages,setSortedMessages]=useState([])
    const [lastRecievedMessage,setLastRecievedMessage]=useState({})
    const [activeUserData,setActiveUserData]=useState({})

    

    useEffect(()=>{
        
        messagesApi.getMessagesByChatId(activeChatId,messages,setSortedMessages)
        if(!user.isAdmin){
            const chat= chatsApi.getChatByUserId(user.id,chats)
            console.log(chat,'-chat')
            if(chat==undefined){
                setIsChatExists(false)
                console.log('no chat')
            }else{
                console.log('chat exists')
                setIsChatExists(true)
                setActiveChatId(chat.id)
            }
        }
        socket.emit('connetion')
    },[])

    useEffect(()=>{
        messagesApi.getMessagesByChatId(activeChatId,messages,setSortedMessages)
        socket.emit('joinRoom',activeChatId)
        setIsChatLoading(false)
    },[activeChatId])

   
    
    
    useEffect(()=>{
        socket.on('getMsg', ({ id, userId, chatId, text }) => {
            console.log('recieved msg')
            if(lastRecievedMessage!={ id, userId, chatId, text }){
                addMessage({ id, userId, chatId, text }); //add to db
                setSortedMessages((prev) => [
                    ...prev,
                    { id, userId, chatId, text },
                ]);
            }
        });
        return () => {
            socket.off('send-message')
        }
    },[])


    useEffect(()=>{
        socket.on('create-chat',(chat)=>{
            if(!user.isAdmin){
                addChat(chat)
                setIsChatExists(true)
                setActiveChatId(chat.id)
            }
        })
        return () => {
            socket.off('create-chat')
        }
    },[])

    return(
        <div className="chat-section">
            <div className="chat_row">
                <div className="chat-users-column">
                    {user.isAdmin?
                        <div className='chat-users-column_scroll'>
                            <div className="chat-users-column_title">Chat feed</div>
                            
                            {chats.map((chat)=>
                                <ChatIcon setActiveUserData={setActiveUserData} key={chat.id} setActiveChat={setActiveChatId} props={chat}/>
                            )}
                        </div>
                    :
                        <> 
                        <div className='join-menu'>
                            <div className='div-join-queue' onClick={() => {setIsChatLoading(true); setIsChatLoadingTitle(false)}}><JoinQueue isChatExists={isChatExists}/></div>
                                {isChatLoading
                                ?<Loader child={"Please wait, the admin will see you as soon as he is free"}></Loader>
                                :<></>
                                }
                                {isChatLoadingTitle
                                ?<div className="div-chat-apply">{massagesForTitle[0]}</div>
                                :<div className="div-chat-apply">{massagesForTitle[1]}</div>
                                }
                        </div>
                        </>
                    }
                </div>
                <div className="chat-messages-column">
                    <div className="chat-messages-column_title">
                        {activeUserData.username} {activeChatId}
                    </div>
                    <div className="chat-messages-feed">
                        <MessagesList sortedMessages={sortedMessages}/>
                    </div>
                    <div className="chat-messages-column_form">
                        <MessageInput 
                            sortedMessages={sortedMessages}
                            setSortedMessages={setSortedMessages}
                            activeChatId={activeChatId}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}