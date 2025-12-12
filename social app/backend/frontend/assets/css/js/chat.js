const api = "/api";
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "null");
if(!token) location.href = "/";

const socket = io();

// mark online on connect
socket.on("connect", ()=> {
  socket.emit("go-online", user.id);
});

// update online
socket.on("user-online", (list) => {
  document.getElementById("onlineCount").innerText = "Online: " + list.length;
});

// receive global message
socket.on("global-message", (payload) => {
  addMessage(payload);
});

// load recent global messages and people
async function load(){
  await loadPeople();
  const res = await fetch(${api}/messages/global, {
    headers: { Authorization: "Bearer "+token }
  });
  if (res.ok) {
    const msgs = await res.json();
    msgs.forEach(m => addMessage({ userId: m.from._id, username: m.from.name, text: m.text, avatarUrl: m.from.avatarUrl }));
  }
}
load();

function addMessage({ userId, username, text, avatarUrl }) {
  const el = document.createElement("div");
  el.className = "message " + (userId === user.id ? "me" : "other");
  el.innerHTML = <div style="font-weight:600">${username}</div><div>${escapeHtml(text)}</div>;
  document.getElementById("messages").appendChild(el);
  document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
}

function escapeHtml(s){ return s.replace(/[&<>"']/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c])); }

async function send(){
  const text = document.getElementById("msg").value.trim();
  if(!text) return;
  // Emit socket
  socket.emit("global-message", { userId: user.id, username: user.name, text });
  // Save to DB
  await fetch(${api}/messages, {
    method:"POST",
    headers: { "Content-Type":"application/json", Authorization: "Bearer "+token },
    body: JSON.stringify({ text })
  });
  document.getElementById("msg").value = "";
}

// People + friend actions
async function loadPeople(q=""){
  const res = await fetch(${api}/users?q=${encodeURIComponent(q)}, { headers: { Authorization: "Bearer "+token }});
  const list = await res.json();
  const container = document.getElementById("peopleList");
  container.innerHTML = "";
  list.forEach(u => {
    if (String(u._id) === String(user.id)) return; // hide myself
    const div = document.createElement("div");
    div.className = "user";
    div.innerHTML = `
      <img src="${u.avatarUrl || '/default-avatar.png'}" />
      <div style="flex:1">
        <div style="font-weight:600">${u.name}</div>
        <div class="small">${u.email}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <button class="btn" onclick="sendRequest