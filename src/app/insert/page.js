"use client"
import { createClient } from '@/utils/supabase/client';
import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation'

export default function InsertPage() {
  const router = useRouter()
  const supabase = createClient();
  const [formData,setFormData] = useState({
    title: '',
    content: '',
    url: '',
    review: '',
    reviewer: '',
    rep1_desc: '',
    rep2_desc: '',
    rep1_img: '',
    rep2_img: '',
    thumbnail: ''
  })
  const [thumbfile,setThumbfile] = useState('');
  const [rep1File,setRep1File] = useState('');
  const [rep2File,setRep2File] = useState('');
  const [authForm, setAuthForm] = useState({
    email:'',
    password:''
  })
  const [user,setUser] = useState(null); // 로그인한 유저 정보 할당
  useEffect(()=>{
    const checkUser = async ()=>{
      const { data: { user } } = await supabase.auth.getUser() // 로그인한 유저 정보 조회
      setUser(user)
    }
    checkUser();
  },[])
    // Upload file using standard upload
  async function uploadFile(file,path) {
    const uniqueFileName = `${Date.now()}-${file.name}`
    //연월일 시분초, 파일이름 그걸 유니크파일네임에 추가
    const { data, error } = await supabase.storage.from('portfolio').upload(`${path}/${uniqueFileName}`, file)
    if (error) {
      // Handle error
      console.log('썸네일 업로드 실패',error)
    } else {
      // Handle success
      console.log('썸네일 업로드 성공',data)
      return data.path; // 파일의 경로 반환
    }
  }
  const handleRep1fileChange = (e)=>{
    const f = e.target.files[0];
    setRep1File(f)
  }
  const handleRep2fileChange = (e)=>{
    const f = e.target.files[0];
    setRep2File(f)
  }
  const handleThumbfileChange = (e)=>{
    const f = e.target.files[0];
    setThumbfile(f)
  }
  
  const handleLogin = async (e)=>{
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword(authForm)
    if(error){
      alert('로그인 실패',error.nessage)
      console.log(error)
    }else{
      alert('로그인 성공');
      //setUser(data.user); // 로그인한 유저의 유저 정보 업데이트
      router.refresh(); // 로그인 후 새로고침
    }
  }
  //텍스트 넣는법
  const handleAuthChange=(e)=>{
    
    const {name, value} = e.target;
    /*
    setAuthForm({
      ...authForm,
      [name]:value
    })
    console.log(authForm);
    */
   setAuthForm(prev=>({...prev, [name]:value}))
  }
  const handleChange=(e)=>{
    
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]:value
    })
  }
  async function InsertDate(e) {
    e.preventDefault();
    /*
    let thumbnailPath = null;
    if(thumbfile){
      thumbnailPath= await uploadFile(thumbfile); // 파일의 경로
    }
    const data = {
      ...formData,
      thumbnail:thumbnailPath
    }
    */
    const data = {
      ...formData,
      thumbnail:thumbfile ? await uploadFile(thumbfile,'thumbnails') : '',
      rep1_img:setRep1File ? await uploadFile(rep1File,'rep') : '',
      rep2_img:setRep2File ? await uploadFile(rep2File,'rep') : '',
    }
    const { error } = await supabase
      .from('portfolio')
      .insert(data)
      if(error){
        console.log('데이터 입력 실패',error)
      }else{
        alert('데이터 입력 완료')
        router.push('/')
      }
  }
  //로그인 전 로그인 폼
  if(!user){
    return(
      <div className="container about_content shadow">
        <h2>로그인</h2>
        <form action="" onSubmit={handleLogin}>
          <div className="mb-3">
            <input type="email" className="form-control" name="email" id="email" placeholder="Your Email" onChange={handleAuthChange}/>
          </div>
          <div className="mb-3">
            <input type="password" className="form-control" name="password" id="password" placeholder="Your Password" onChange={handleAuthChange}/>
          </div>
          <button className="btn btn-primary">로그인</button>
        </form>
      </div>
    )
  }


  //로그인 후 입력 폼
  return (
    <>
      <div className="container about_content shadow">
        <h2>데이터 입력</h2>
        <form action="" onSubmit={InsertDate}>
          <div className="mb-3">
            <input type="text" className="form-control" name="title" id="title" placeholder="title" onChange={handleChange}/>
          </div>
          <div className="mb-3">
            <textarea className="form-control" name="content" id="content" rows="3" placeholder="content" onChange={handleChange} ></textarea>
          </div>
          <div className="mb-3">
            <input type="url" className="form-control" name="url" placeholder="url" onChange={handleChange} />
          </div>
          <div className="mb-3">
            <textarea className="form-control" name="review" id="review" rows="3" placeholder="review" onChange={handleChange} ></textarea>
          </div>
          <div className="mb-3">
            <input type="text" className="form-control" name="reviewer" placeholder="reviewer Writer" onChange={handleChange} />
          </div>
          <div className="mb-3">
            <input className="form-control" title="rep1_img" type="file" name="rep1_img" onChange={handleRep1fileChange}/>
          </div>
          <div className="mb-3">
            <input type="text" className="form-control" name="rep1_desc" placeholder="img1 description" onChange={handleChange} />
          </div>
          <div className="mb-3">
            <input className="form-control" type="file" title="rep2_img" name="rep2_img" onChange={handleRep2fileChange}/>
          </div>
          <div className="mb-3">
            <input type="text" className="form-control" name="rep2_desc" placeholder="img2 description" onChange={handleChange} />
          </div>
          <div className="mb-3">
            <input className="form-control" type="file" title="thumbnail" name="thumbnail" onChange={handleThumbfileChange}/>
          </div>
          <button className="btn btn-primary">전송</button>
        </form>
      </div>
    </>
  )
}