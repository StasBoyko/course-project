import { useEffect, useState } from "react"
import { useUserStore } from "../../../../store"


const Message=({message})=>{
    const {user}=useUserStore()
    const [isMyMessage,setIsMyMessage]=useState(false)

    useEffect(()=>{
        setIsMyMessage(user.id==message.userId)
        console.log('newMessage',message)
    },[])

    return(
        <div style={{textAlign:`${isMyMessage?'right':'left'}`, padding:'2px',}} key={message.id}>
            <p style={{display:'inline',padding:'2px',borderRadius:'5px',background:'#4287f5', color:'white'}}>{message.text}</p><br/>
        </div>
    )
}

export const MessagesList=({sortedMessages})=>{
    
    return(
        <>
            {sortedMessages.map(message=>
                <Message key={message.id} message={message}/>
            )}
        </>
    )
}
