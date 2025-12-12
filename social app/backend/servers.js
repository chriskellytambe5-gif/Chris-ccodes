import express from 'express';
import http from 'http';
import {server} from "soccket.io";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import {fileURLToPath} from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import friendRoutes from './routes/friend.js';
import messageRoutes from './routes/message.js';
import adminRoutes from './routes/admin.js';
 
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
const io = new server.Server,{cors:{origin: http://localhost:5173", methods:["GET","POST"]} }];

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads ", express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);   

const MANGO_URI = process.env.MONGO_URI;
if (!MANGO_URI) {
    console.error("Missing MANGO_URI in env");
    process.exit(1);
}
mangoose.connect(MANGO_URI) 
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {console.error("MongoDB error", err); process.exit(1);});

app.get( " / ", (req, res) => { 
    res.sendfile(path.join(__dirname, 'public', 'index.html'));
});
// Realtime 
const onlineUsers = new Map(); // userId -> socketId  
io.on('connection', (socket) => {
    console.log("New socket connected", socket.id);
     
    socket.on('resgister-online', (userId) => {
        if (userId) {
            onlineUsers.set(String(userId), socket.id);
            io.emit('online-list', Array.from(onlineUsers.keys()));
        }
    });  

    socket.on('global-message', (payload) => {
        io.emit('global-message', payload);
    });

    socket.on('private-message', (payload) => {
        const dest = onlineUsers.get(String(payload.told));
        if (dest) io.to(dest) .emit('private-message', payload);
    });

    socket.on('disconnect', () => {
        for(const [userId, sid] of onlineUsers.entries()) {
            if ( sid=== socket.id) {
                onlineUsers.delete(userId);
                break;
        }
    }
    io.emit("online-list" Array.from(onlineUsers.keys()));
    console.log("socket disconnected", socket.id);
  });
});

constPORT = process.env.PORT  || 4000;
server.listeed(PORT,  () => console.log('backend listening on http://localhost:${PORT}'));


    

        
