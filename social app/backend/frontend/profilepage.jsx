import React, { useEffect, useState } from "react";
import API from "../../services/api";

export default function ProfilePage(){
  const [user, setUser] = useState(null);
  const [name,setName] = useState("");
  const [bio,setBio] = useState("");
  const [avatar, setAvatar] = useState(null);

  useEffect(()=>{
    async function load(){
      const token = localStorage.getItem("social_token");
      const res = await API.get("/users/me", { headers: { Authorization: Bearer ${token} }});
      setUser(res.data);
      setName(res.data.name);
      setBio(res.data.bio || "");
    }
    load();
  }, []);

  async function save(){
    const fd = new FormData();
    fd.append("name", name);
    fd.append("bio", bio);
    if (avatar) fd.append("avatar", avatar);
    const token = localStorage.getItem("social_token");
    const res = await API.put("/users/me", fd, { headers: { Authorization: Bearer ${token} }});
    alert("Saved");
    setUser(res.data.user);
    localStorage.setItem("social_user", JSON.stringify(res.data.user));
  }

  if (!user) return <div className="card">Loading...</div>;
  return (
    <div className="card" style={{maxWidth:720,margin:"16px auto"}}>
      <h2>Profile</h2>
      <div style={{marginTop:8}}>
        <img src={user.avatarUrl || "/default-avatar.png"} alt="avatar" style={{width:120,height:120,borderRadius:12,objectFit:"cover"}} />
      </div>
      <div style={{marginTop:8}}><input className="input" value={name} onChange={e=>setName(e.target.value)} /></div>
      <div style={{marginTop:8}}><textarea className="input" value={bio} onChange={e=>setBio(e.target.value)} /></div>
      <div style={{marginTop:8}}><input type="file" onChange={e=>setAvatar(e.target.files[0])} /></div>
      <div style={{marginTop:12}}><button className="btn" onClick={save}>Save</button></div>
    </div>
  );
}