// lib/socketClient.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocketClient(): Socket {
  if (!socket || !socket.connected) {
    // Use your actual Socket.IO server URL
    const SOCKET_URL = process.env.SOCKET_URL || "http://localhost:3001";

    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("✅ Next.js API connected to Socket.IO server:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Next.js API disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
    });
  }

  return socket;
}

// Helper function to notify mobile
export function notifyMobile({
  userId,
  event,
  data,
}: {
  userId: string;
  event: string;
  data: any;
}) {
  const socket = getSocketClient();

  if (socket.connected) {
    socket.emit("notifyMobile", {
      room: userId,
      event,
      data,
    });
    console.log(`📤 Notification sent to room: ${userId}, event: ${event}`);
  } else {
    console.error("❌ Socket not connected, cannot send notification");
  }
}
