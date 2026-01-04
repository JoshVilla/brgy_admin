"use client";

import React, {
  ReactNode,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { useWebSocket } from "../contexts/WebSocketContext";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router = useRouter();
  const socket = useWebSocket();

  // 🔔 Notification sound (single instance)
  const bellRef = useRef<HTMLAudioElement | null>(null);
  const audioUnlockedRef = useRef(false);

  // 📱 Screen size
  const [isDesktop, setIsDesktop] = useState(true);

  // 🧭 Sidebar ref
  const sidebarRef = useRef<{ close?: () => void } | null>(null);

  /* ---------------- SCREEN SIZE ---------------- */
  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth >= 768);

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  /* ---------------- AUDIO INIT ---------------- */
  useEffect(() => {
    // Create and preload audio
    const audio = new Audio("/sound/notify.mp3");
    audio.preload = "auto";
    audio.load();
    bellRef.current = audio;

    // Unlock audio on user interaction
    const unlockAudio = async () => {
      // Only try if not already unlocked
      if (audioUnlockedRef.current || !bellRef.current) return;

      try {
        // Attempt to play and immediately pause to unlock
        bellRef.current.volume = 0;
        await bellRef.current.play();
        bellRef.current.pause();
        bellRef.current.currentTime = 0;
        bellRef.current.volume = 1;

        audioUnlockedRef.current = true;
        console.log("✅ Audio unlocked successfully");

        // Remove listeners once unlocked
        events.forEach((event) => {
          document.removeEventListener(event, unlockAudio);
        });
      } catch (error) {
        // Keep trying on subsequent interactions
        console.log(
          "⏳ Audio unlock attempt failed, will retry on next interaction"
        );
      }
    };

    // Listen to multiple interaction types (no 'once' option)
    const events = ["click", "keydown", "touchstart", "mousedown"];
    events.forEach((event) => {
      document.addEventListener(event, unlockAudio, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, unlockAudio);
      });
    };
  }, []);

  /* ---------------- SOCKET NOTIFICATIONS ---------------- */
  const handleNotification = useCallback(
    (data: any) => {
      console.log(data);
      toast.success(data.message, {
        description: data.data.type,
        icon: <CheckCircle className="text-sky-500" width={20} />,
        style: {
          backgroundColor: "#e0f2fe",
          border: "1px solid #38bdf8",
          color: "#0369a1",
        },
        className: "font-semibold",
        descriptionClassName: "text-xs text-sky-700",
        action: {
          label: "Go",
          onClick: () => router.push("/admin/request"),
        },
      });

      // Play notification sound
      if (bellRef.current) {
        const playSound = async () => {
          try {
            bellRef.current!.currentTime = 0;
            await bellRef.current!.play();
            console.log("🔔 Notification sound played");
          } catch (error) {
            console.warn("❌ Audio playback failed:", error);
            if (!audioUnlockedRef.current) {
              console.log(
                "💡 Click anywhere on the page to enable notification sounds"
              );
            }
          }
        };
        playSound();
      }
    },
    [router]
  );

  useEffect(() => {
    if (!socket) return;

    socket.on("adminNotification", handleNotification);

    return () => {
      socket.off("adminNotification", handleNotification);
    };
  }, [socket, handleNotification]);

  /* ---------------- SIDEBAR HANDLER ---------------- */
  const handleSidebarItemClick = useCallback(() => {
    if (!isDesktop) {
      sidebarRef.current?.close?.();
    }
  }, [isDesktop]);

  /* ---------------- RENDER ---------------- */

  return (
    <SidebarProvider
      //@ts-ignore
      ref={sidebarRef}
      defaultOpen={isDesktop}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" onItemClick={handleSidebarItemClick} />

      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2 p-4">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
