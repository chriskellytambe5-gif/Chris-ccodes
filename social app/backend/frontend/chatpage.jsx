import React, { useEffect, useState, useRef } from "react";
import API from "../../services/api";
import { getUser } from "../../services/auth";
import { initSocket, getSocket } from "../../services/socket";

export default function ChatPage(){
  const user = getUser();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);
  const messagesRef = useRef();
  messagesRef.current = messages;

  useEffect(() => {
    async function load() {
      const res = await API.get("/messages/global", { headers: { Authorization: Bearer ${localStorage.getItem("social_token")} }});
      setMessages(res.data);
    }
    load();
    socketRef.current = initSocket();
    socketRef.current.emit("register-online", user.id);

    socketRef.current.on("global-message", (payload) => {
      setMessages(prev => [...prev, payload]);
    });

    return () => { /* cleanup */ };
  }, []);

  async function send(){
    if (!text.trim()) return;
    const payload = { fromId: user.id, fromName: user.name, text };
    socketRef.current.emit("global-message", payload);
    await API.post("/messages", { text }, { headers: { Authorization: Bearer ${localStorage.getItem("social_token")} }});
    setMessages(prev => [...prev, { from: { _id: user.id, name: user.name }, text }]);
    setText("");
  }

  return (
    <div className="card chat-wrap">
      <div className="side">
        <h3>People</h3>
        <p className="small">Use Friends page to add people</p>
      </div>
      <div className="chat-box">
        <h3>Global Chat</h3>
        <div className="messages">
          {messages.map((m, idx) => (
            <div key={idx} className={message ${m.from._id === user.id ? "me" : "other"}}>
              <div style={{fontWeight:600}}>{m.from.name}</div>
              <div>{m.text}</div>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input className="input" value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message..." />
          <button className="btn" onClick={send}>Send</button>
        </div>
      </div>
    </div>
  );
}