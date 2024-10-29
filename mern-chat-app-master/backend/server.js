import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',  // Explicitly specify your frontend URL
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true  // This is needed to allow cookies with CORS
  }));
// Your routes and middleware here



// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Fallback route for testing
app.get("/api/test", (req, res) => {
    res.status(200).json({ message: "Server is working correctly!" });
});
app.get("/api", (req, res) => {
    res.status(200).json({ message: "Server is working correctly!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
