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
import { CheckCircle, AlertTriangle, MapPin, User, Clock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AdminLayoutProps {
  children: ReactNode;
}

interface IncidentData {
  user: string;
  type: string;
  location: string;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router = useRouter();
  const socket = useWebSocket();

  // 🔔 Notification sounds (separate instances)
  const bellRef = useRef<HTMLAudioElement | null>(null);
  const alarmRef = useRef<HTMLAudioElement | null>(null);
  const audioUnlockedRef = useRef(false);

  // 📱 Screen size
  const [isDesktop, setIsDesktop] = useState(true);

  // 🧭 Sidebar ref
  const sidebarRef = useRef<{ close?: () => void } | null>(null);

  // 🚨 Incident Modal State
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [incidentData, setIncidentData] = useState<IncidentData | null>(null);

  /* ---------------- SCREEN SIZE ---------------- */
  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth >= 768);

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  /* ---------------- AUDIO INIT ---------------- */
  useEffect(() => {
    // Create and preload both audio files
    const audioNotify = new Audio("/sound/notify.mp3");
    const audioAlarm = new Audio("/sound/error-alarm.wav");

    audioNotify.preload = "auto";
    audioAlarm.preload = "auto";

    audioNotify.load();
    audioAlarm.load();

    bellRef.current = audioNotify;
    alarmRef.current = audioAlarm;

    // Unlock audio on user interaction
    const unlockAudio = async () => {
      if (audioUnlockedRef.current) return;

      try {
        // Unlock both audio files
        const unlockPromises = [bellRef.current, alarmRef.current]
          .filter(Boolean)
          .map(async (audio) => {
            audio!.volume = 0;
            await audio!.play();
            audio!.pause();
            audio!.currentTime = 0;
            audio!.volume = 1;
          });

        await Promise.all(unlockPromises);
        audioUnlockedRef.current = true;
        console.log("✅ Audio unlocked successfully");

        // Remove listeners once unlocked
        events.forEach((event) => {
          document.removeEventListener(event, unlockAudio);
        });
      } catch (error) {
        console.log(
          "⏳ Audio unlock attempt failed, will retry on next interaction",
        );
      }
    };

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

  /* ---------------- PLAY SOUND HELPER ---------------- */
  const playSound = useCallback(
    async (audioRef: React.MutableRefObject<HTMLAudioElement | null>) => {
      if (!audioRef.current) return;

      try {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
        console.log("🔔 Sound played");
      } catch (error) {
        console.warn("❌ Audio playback failed:", error);
        if (!audioUnlockedRef.current) {
          console.log(
            "💡 Click anywhere on the page to enable notification sounds",
          );
        }
      }
    },
    [],
  );

  /* ---------------- CERTIFICATE REQUEST NOTIFICATION ---------------- */
  const handleNotification = useCallback(
    (data: any) => {
      console.log("📄 Certificate Request:", data);

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

      playSound(bellRef);
    },
    [router, playSound],
  );

  /* ---------------- INCIDENT NOTIFICATION ---------------- */
  const handleNotificationIncident = useCallback(
    (data: any) => {
      console.log("🚨 Incident Report:", data);

      // Set incident data and show modal
      setIncidentData(data.data);
      setShowIncidentModal(true);

      // Play alarm sound
      playSound(alarmRef);
    },
    [playSound],
  );

  /* ---------------- SOCKET LISTENERS ---------------- */
  useEffect(() => {
    if (!socket) return;

    socket.on("adminNotification", handleNotification);
    socket.on("adminNotificationIncident", handleNotificationIncident);

    return () => {
      socket.off("adminNotification", handleNotification);
      socket.off("adminNotificationIncident", handleNotificationIncident);
    };
  }, [socket, handleNotification, handleNotificationIncident]);

  /* ---------------- SIDEBAR HANDLER ---------------- */
  const handleSidebarItemClick = useCallback(() => {
    if (!isDesktop) {
      sidebarRef.current?.close?.();
    }
  }, [isDesktop]);

  /* ---------------- MODAL HANDLERS ---------------- */
  const handleViewIncident = () => {
    setShowIncidentModal(false);
    router.push("/admin/incident-report");
  };

  const handleDismiss = () => {
    setShowIncidentModal(false);
  };

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

      {/* Incident Alert Dialog */}
      <AlertDialog open={showIncidentModal} onOpenChange={setShowIncidentModal}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <AlertDialogTitle className="text-xl font-bold text-red-900">
                  New Incident Report
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-red-700">
                  Immediate attention required
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          {incidentData && (
            <div className="space-y-4 py-4">
              {/* Incident Type */}
              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">
                    Incident Type
                  </span>
                </div>
                <p className="text-lg font-bold text-red-900">
                  {incidentData.type}
                </p>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">
                    Location
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {incidentData.location}
                  </p>
                </div>
              </div>

              {/* Reporter */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                <User className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">
                    Reported By
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {incidentData.user}
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                <Clock className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">
                    Time
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel onClick={handleDismiss} className="mt-0">
              Dismiss
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleViewIncident}
              className="bg-red-600 hover:bg-red-700"
            >
              View Incident Details
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default AdminLayout;
