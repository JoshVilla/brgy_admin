import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*", // change this in production!
    methods: ["GET", "POST"],
    pingInterval: 25000,
    pingTimeout: 60000,
  },
});

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  socket.on("newRequest", (data) => {
    console.log("📨 New request from mobile:", data);

    // Notify admin
    io.emit("adminNotification", {
      type: "new-request",
      message: `New request from ${data.user}`,
      data,
    });
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Client disconnected:", socket.id, reason);
  });
});

httpServer.listen(3001, "0.0.0.0", () => {
  console.log("🚀 WebSocket server running at http://localhost:3001");
});
