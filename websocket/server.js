import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*", // change this in production!
    methods: ["GET", "POST"],
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

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

httpServer.listen(3000, () => {
  console.log("🚀 WebSocket server running at http://localhost:3000");
});
