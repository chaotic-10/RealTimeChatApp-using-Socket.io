// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const PORT = 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(cors());

io.on('connection', (socket) => {

    socket.on('join', (username) => {
        console.log(`${username} has joined the chat`);
        socket.broadcast.emit('userJoined', `${username} has joined the chat`);
        socket.emit('welcome', `Welcome to the chat, ${username}!`);
      });
    
    console.log('Client connected');
    console.log("id", socket.id);
    socket.emit("welcome", `Welcome to the chat, user: ${socket.id}`);
    socket.broadcast.emit("userJoined", `${socket.id} has joined the chat`);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        io.emit("userLeft", `${socket.id} has left the chat`);
    });

    socket.on('sendMessage', (message) => {
        console.log('Received message:', message);
        io.emit('message', `${socket.id}: ${message}`);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
