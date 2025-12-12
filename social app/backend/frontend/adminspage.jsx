import React, { useEffect, useState } from "react";
import API from "../../services/api";

export default function AdminPage(){
  const [users, setUsers] = useState([]);

  useEffect(()=> load(), []);
  async function load(){
    const token = localStorage.getItem("social_token");
    const res = await API.get("/admin/users", { headers: { Authorization: Bearer ${token} }});
    if (!res.data) { alert("Admin access required"); return; }
    setUsers(res.data);
  }

  async function ban(id){ const token = localStorage.getItem("social_token"); await API.post(/admin/user/${id}/ban, {}, { headers:{ Authorization:Bearer ${token} }}); alert("Banned"); load(); }
  async function unban(id){ const token = localStorage.getItem("social_token"); await API.post(/admin/user/${id}/unban, {}, { headers:{ Authorization:Bearer ${token} }}); alert("Unbanned"); load(); }

  return (
    <div className="card">
      <h3>Admin Dashboard</h3>
      <table className="table">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Banned</th><th>Action</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{String(u.banned)}</td>
              <td>
                {u.banned ? <button className="btn" onClick={()=>unban(u._id)}>Unban</button> : <button className="btn" onClick={()=>ban(u._id)}>Ban</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}