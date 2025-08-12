"use client"
import { createClient } from '@/utils/supabase/client';
import React, { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation'


export default function LoginStatus(){
  const [user,setUser] = useState(null); // 로그인한 유저 정보 할당
  const supabase = createClient();
  const router = useRouter()
  useEffect(()=>{
    (async ()=>{
      const { data :{ user }} = await supabase.auth.getUser(); // 로그인한 유저 정보 조회
      setUser(user);
    })()
  },[supabase.auth,user])
  const handleLogout = async ()=>{
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
    router.refresh();
  }
  if(user){
    return(
      <li><button className="btn btn-primary" onClick={handleLogout}>Logout</button></li>
    )
  }else{
    return null;
  }
}