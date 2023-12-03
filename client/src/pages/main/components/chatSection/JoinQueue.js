import styles from "./joinQueueCss.css"
import { useState } from 'react'
import socket from '../../../../socket'
import { useUserStore } from '../../../../store'
import { Loader } from "../../../../componetns/loader/Loader"

export const JoinQueue=({isChatExists})=>{
    const {user}=useUserStore()

    const addToQueueHandler=()=>{
        socket.emit('add-user-to-queue',user,socket.id)
    }
    
    return(
        <>
            {isChatExists?
                <></>
            :
            <div>
                <button 
                onClick={()=>addToQueueHandler()}
                className='join-queue-button'
                >
                    Apply for queue
                </button>
                
            </div>  
            }    
        </>
        
    )
}