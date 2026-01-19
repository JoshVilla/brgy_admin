// websocket/server.js
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: "*", // restrict in production
    methods: ["GET", "POST"],
  },
  pingInterval: 25000,
  pingTimeout: 60000,
});

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  // 🔑 Mobile / Admin joins personal room
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`👤 User joined room: ${userId}`);
  });

  // 📱 Mobile → Admin
  socket.on("newRequest", (data) => {
    console.log("📨 New request from mobile:", data);

    io.emit("adminNotification", {
      type: "new-request",
      message: `New request from ${data.user}`,
      data,
    });
  });

  socket.on("newIncident", (data) => {
    console.log("📨 New request from mobile:", data);

    io.emit("adminNotificationIncident", {
      type: "new-incident",
      message: `New request from ${data.user}`,
      data,
    });
  });

  // 🔔 Next.js API → Mobile (ADD THIS)
  socket.on("notifyMobile", ({ room, event, data }) => {
    console.log(`📤 Forwarding to room: ${room}, event: ${event}`);
    io.to(room).emit(event, data);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Client disconnected:", socket.id, reason);
  });
});

httpServer.listen(3001, "0.0.0.0", () => {
  console.log("🚀 WebSocket server running at http://localhost:3001");
});
