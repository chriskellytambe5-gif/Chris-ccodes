import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, clearAuth } from "../../services/auth";

export default function Navbar() {
  const user = getUser();
  const nav = useNavigate();
  function logout(){ clearAuth(); nav("/login"); }
  return (
    <div className="navbar">
      <div className="brand"><strong>Social App</strong></div>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/chat">Chat</Link>
            <Link to="/friends">Friends</Link>
            <Link to="/profile">Profile</Link>
            {user.role === "admin" && <Link to="/admin">Admin</Link>}
            <button className="btn" onClick={logout}>Logout</button>
            <img src={user.avatarUrl || "/default-avatar.png"} alt="me" className="user-avatar" />
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}