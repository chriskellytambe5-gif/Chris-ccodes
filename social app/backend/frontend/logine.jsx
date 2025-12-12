import React, { useState } from "react";
import API from "../../services/api";
import { saveAuth } from "../../services/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      saveAuth(res.data.token, res.data.user);
      nav("/chat");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="card" style={{maxWidth:720,margin:"16px auto"}}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div style={{marginTop:8}}><input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"/></div>
        <div style={{marginTop:8}}><input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password"/></div>
        <div style={{marginTop:12}}><button className="btn" type="submit">Login</button></div>
      </form>
    </div>
  );
}