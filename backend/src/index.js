import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from "./lib/db.js";
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { app, server } from './lib/socket.js';
import { Server } from 'socket.io';

dotenv.config();


const PORT = process.env.PORT;

app.use(express.json({ limit: '5mb' })); // Increase the limit to 5MB
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200 // Allow legacy browsers to support CORS
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
    console.log('Server is running on port PORT:' + PORT);
    connectDB();
});
