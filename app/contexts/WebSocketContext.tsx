"use client";
import React, { createContext, useContext, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

// Create a single socket instance outside the component
const socket: Socket<DefaultEventsMap, DefaultEventsMap> = io(
  "http://192.168.1.195:3001",
  {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  }
);

type WebSocketContextType = Socket<DefaultEventsMap, DefaultEventsMap>;

const WebSocketContext = createContext<WebSocketContextType>(socket);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO server:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.warn("❌ Disconnected from Socket.IO server:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket.IO connection error:", err.message);
    });

    // No disconnect on unmount to keep socket alive across HMR
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context)
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  return context;
};
