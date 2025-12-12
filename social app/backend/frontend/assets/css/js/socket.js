import { io } from "socket.io-client";
let socket = null;

export function initSocket() {
  if (!socket) socket = io("http://localhost:4000");
  return socket;
}