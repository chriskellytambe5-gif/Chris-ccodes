import React, { useEffect, useState } from "react";
import API from "../../services/api";

export default function FriendsPage(){
  const [people, setPeople] = useState([]);

  useEffect(()=> { load(); }, []);
  async function load(q=""){
    const token = localStorage.getItem("social_token");
    const res = await API.get(/users?q=${encodeURIComponent(q)}, { headers: { Authorization: Bearer ${token} }});
    setPeople(res.data);
  }

  async function sendRequest(id){
    const token = localStorage.getItem("social_token");
    const res = await API.post(/friends/request/${id}, {}, { headers: { Authorization: Bearer ${token} }});
    alert(res.data.message || "Request sent");
  }

  return (
    <div className="card" style={{padding:16}}>
      <h3>Find people</h3>
      <div style={{marginTop:12}} className="user-list">
        {people.map(p => (
          <div key={p._id} className="user">
            <img src={p.avatarUrl || "/default-avatar.png"} alt="" style={{width:56,height:56,borderRadius:8}}/>
            <div style={{flex:1}}>
              <div style={{fontWeight:600}}>{p.name}</div>
              <div className="small">{p.email}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <button className="btn" onClick={()=>sendRequest(p._id)}>Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}