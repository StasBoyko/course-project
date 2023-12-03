import { BrowserRouter, Routes } from "react-router-dom";
import { Header,AuthLayout } from "./componetns";
import { useUserStore } from "./store";
import { useEffect, useState } from "react";
import userApi from "./api/userApi";
import socket from "./socket";


function App() {

  const {isAuth,user,setAuth}=useUserStore()

  useEffect(()=>{
    userApi.rehost(setAuth)
    
  },[])

  useEffect(()=>{
    if(user.isAdmin){
      socket.emit('join-admin-room')
    }
  },[user])


  return (
    <AuthLayout isAuth={isAuth}/>
  );
}

export default App;
