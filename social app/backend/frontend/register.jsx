import React, { useState } from "react";
import API from "../../services/api";
import { saveAuth } from "../../services/auth";
import { useNavigate } from "react-router-dom";

export default function Register(){
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [avatar,setAvatar] = useState(null);
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("email", email);
      fd.append("password", password);
      if (avatar) fd.append("avatar", avatar);

      const res = await API.post("/auth/register", fd);
      saveAuth(res.data.token, res.data.user);
      nav("/chat");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  }

  return (
    <div className="card" style={{maxWidth:720,margin:"16px auto"}}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <div style={{marginTop:8}}><input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Full name"/></div>
        <div style={{marginTop:8}}><input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"/></div>
        <div style={{marginTop:8}}><input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password"/></div>
        <div style={{marginTop:8}}><input type="file" onChange={e=>setAvatar(e.target.files[0])}/></div>
        <div style={{marginTop:12}}><button className="btn" type="submit">Register</button></div>
      </form>
    </div>
  );
}