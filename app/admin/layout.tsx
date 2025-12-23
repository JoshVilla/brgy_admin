"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
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
  const bellRef = useRef<HTMLAudioElement | null>(null);
  const [canPlaySound, setCanPlaySound] = useState(false);

  // Sidebar provider ref
  const sidebarRef = useRef<any>(null);

  // Auto-play sound setup
  useEffect(() => {
    bellRef.current = new Audio("/sound/notify.mp3");

    const allowSound = () => {
      setCanPlaySound(true);
      document.removeEventListener("click", allowSound);
    };

    document.addEventListener("click", allowSound);
    return () => document.removeEventListener("click", allowSound);
  }, []);

  // WebSocket notifications

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data: any) => {
      toast.success(data.message, {
        description: data.data.requestType,
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
          onClick: () => router.push("/admin/request/"),
        },
      });

      if (canPlaySound && bellRef.current) {
        bellRef.current.currentTime = 0;
        bellRef.current.play().catch((err) => console.error(err));
      }
    };

    socket.on("adminNotification", handleNotification);

    // Cleanup function
    return () => {
      socket.off("adminNotification", handleNotification);
    };
  }, [socket, canPlaySound, router]);

  // Close sidebar on mobile when clicking an item
  const handleSidebarItemClick = () => {
    if (window.innerWidth < 768 && sidebarRef.current) {
      sidebarRef.current.close(); // Use provider's built-in close method
    }
  };

  return (
    <SidebarProvider
      ref={sidebarRef}
      defaultOpen={false} // sidebar initially closed on mobile
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
