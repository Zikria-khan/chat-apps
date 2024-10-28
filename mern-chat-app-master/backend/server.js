import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

// Environment variables
const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 3000;

// CORS configuration to allow all originsconst corsOptions = {
    const corsOptions = {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "OPTIONS"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"], // Ensures preflight request headers are allowed
    };
    
    // Allow OPTIONS method
    app.options("*", cors(corsOptions)); // This will handle preflight
    app.use(cors(corsOptions));
    
// Allow OPTIONS method
app.options("*", cors(corsOptions)); // This will handle preflight
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/api/test", (req, res) => {
    res.status(200).json({ message: "Help me!" });
});
app.get("/", (req, res) => {
    res.status(200).json({ message: "This is the success that I want from me!" });
});
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");

        // Create the HTTP server
        const server = http.createServer(app);

        // Initialize Socket.IO with the HTTP server
        const io = new Server(server, {
            cors: { origin: "*" }, // Allows all origins for WebSocket
        });

        // Socket.IO event handling
        io.on("connection", (socket) => {
            console.log("A user connected");
            socket.on("message", (msg) => {
                console.log("Message received:", msg);
                io.emit("message", msg);
            });

            socket.on("disconnect", () => {
                console.log("User disconnected");
            });
        });

        // Start the server
        server.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error.message);
    });
