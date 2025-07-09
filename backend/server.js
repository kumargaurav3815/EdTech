/** @format */

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// Route imports
import authRoutes from "./routes/auth.js";
import classRoutes from "./routes/class.js";
import quizRoutes from "./routes/quiz.js";
import assignmentRoutes from "./routes/assignment.js";
import quizSubmissionRoutes from "./routes/quizSubmission.js";
import assignmentSubmissionRoutes from "./routes/assignmentSubmission.js";
import recordRoutes from "./routes/record.js";
import teacherRoutes from "./routes/teacherRoutes.js";

// Load env
dotenv.config();

// App and server setup
const app = express();
const server = http.createServer(app);

// Parse allowed client URLs from .env
const allowedOrigins = (process.env.CLIENT_URLS || "")
  .split(",")
  .map((url) => url.trim());

// =====================
// 🔐 Middleware
// =====================
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// =====================
// 🔗 API Routes
// =====================
app.use("/api/auth", authRoutes);
app.use("/api/class", classRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/assignment", assignmentRoutes);
app.use("/api/quiz-submissions", quizSubmissionRoutes);
app.use("/api/assignment-submissions", assignmentSubmissionRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/teacher", teacherRoutes);

// =====================
// 💬 Socket.IO Events
// =====================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Inside io.on("connection", ...)
io.on("connection", (socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);

  socket.on("joinRoom", (roomId) => {
    if (roomId) {
      socket.join(roomId);
      console.log(`✅ ${socket.id} joined room: ${roomId}`);
    }
  });

  socket.on("chatMessage", ({ roomId, sender, message, time }) => {
    if (roomId && sender && message) {
      const payload = {
        sender,
        message,
        time:
          time ||
          new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }),
      };
      io.to(roomId).emit("chatMessage", payload);
    }
  });

  // 🔄 Socket.IO Leave Event
  socket.on("leaveRoom", ({ roomId, role }) => {
    if (roomId && role) {
      socket.leave(roomId);
      console.log(`👋 ${role} left room: ${roomId}`);
      socket.to(roomId).emit("userLeft", { role });
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ Disconnected: ${socket.id}`);
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

export { io };
