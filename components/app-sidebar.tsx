"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Calendar1,
  ChartGantt,
  FileText,
  GitGraph,
  Megaphone,
  MessageSquareWarning,
  Scale,
  ShieldUser,
  Users2,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getPrivilages } from "@/services/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { IResAdmin } from "@/utils/types";
import { IGeneralSettings } from "@/models/settingsModel";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onItemClick?: () => void;
}

// Map navigation items to their privilege keys
const privilegeKeyMap: Record<string, keyof IPrivilege> = {
  Dashboard: "dashboard",
  "Resident Management": "resident",
  Announcements: "announcement",
  Events: "event",
  Requests: "request",
  Blotters: "blotter",
  Analytics: "analytic",
  Legislatives: "legislative",
  Admins: "admin",
  "Brgy Officials": "official",
  Settings: "setting",
};

interface IPrivilege {
  _id: string;
  adminId: string;
  dashboard: number;
  resident: number;
  announcement: number;
  event: number;
  request: number;
  blotter: number;
  analytic: number;
  legislative: number;
  admin: number;
  official: number;
  setting: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export function AppSidebar({ onItemClick, ...props }: AppSidebarProps) {
  const adminInfo = useSelector(
    (state: RootState) => state.admin.adminInfo as IResAdmin
  );

  const settingsInfo = useSelector(
    (state: RootState) => state.settings.settingsInfo as IGeneralSettings
  );

  const { data, isLoading } = useQuery({
    queryKey: ["menu", adminInfo._id],
    queryFn: () => getPrivilages({ adminId: adminInfo._id }),
  });

  const navItems = [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Resident Management",
      url: "/admin/resident-management/",
      icon: Users2,
    },
    {
      title: "Announcements",
      url: "/admin/announcements/",
      icon: Megaphone,
    },
    {
      title: "Events",
      url: "/admin/events/",
      icon: Calendar1,
    },
    {
      title: "Requests",
      url: "/admin/request/",
      icon: FileText,
    },
    {
      title: "Blotters",
      url: "/admin/blotters/",
      icon: MessageSquareWarning,
    },
    {
      title: "Analytics",
      url: "/admin/analytics/",
      icon: ChartGantt,
    },
    {
      title: "Legislatives",
      url: "/admin/legislatives/",
      icon: Scale,
    },
    {
      title: "Admins",
      url: "/admin/admins/",
      icon: ShieldUser,
    },
    {
      title: "Brgy Officials",
      url: "/admin/officials/",
      icon: ShieldUser,
    },
    {
      title: "Settings",
      url: "/admin/settings/",
      icon: Wrench,
    },
  ];

  // Filter nav items based on privileges
  const filteredNavItems = React.useMemo(() => {
    if (!data?.data) return [];

    const privileges = data.data as IPrivilege;

    return navItems.filter((item) => {
      const privilegeKey = privilegeKeyMap[item.title];
      if (!privilegeKey) return false;
      return privileges[privilegeKey] === 1;
    });
  }, [data]);

  const dataMenu = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: filteredNavItems,
    navClouds: [
      {
        title: "Capture",
        icon: IconCamera,
        isActive: true,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
      {
        title: "Proposal",
        icon: IconFileDescription,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
      {
        title: "Prompts",
        icon: IconFileAi,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "#",
        icon: IconSettings,
      },
      {
        title: "Get Help",
        url: "#",
        icon: IconHelp,
      },
      {
        title: "Search",
        url: "#",
        icon: IconSearch,
      },
    ],
    documents: [
      {
        name: "Data Library",
        url: "#",
        icon: IconDatabase,
      },
      {
        name: "Reports",
        url: "#",
        icon: IconReport,
      },
      {
        name: "Word Assistant",
        url: "#",
        icon: IconFileWord,
      },
    ],
  };

  // Get logo and title from settings with fallbacks
  const adminLogo = settingsInfo?.adminLogo || "/logo/laurel_logo.png";
  const adminTitle = settingsInfo?.adminTitle || "Brgy Laurel Admin";

  // Show loading state
  if (isLoading) {
    return (
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#" onClick={onItemClick}>
                  <div className="relative w-[30px] h-[30px] flex-shrink-0">
                    <Image
                      alt="brgy logo"
                      src={adminLogo}
                      fill
                      className="object-contain"
                      sizes="30px"
                    />
                  </div>
                  <span className="text-base font-semibold">{adminTitle}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <div className="flex items-center justify-center p-4">
            <p className="text-sm text-muted-foreground">Loading menu...</p>
          </div>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={dataMenu.user} />
        </SidebarFooter>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#" onClick={onItemClick}>
                <div className="relative w-[30px] h-[30px] flex-shrink-0">
                  <Image
                    alt="brgy logo"
                    src={adminLogo}
                    fill
                    className="object-contain"
                    sizes="30px"
                    priority
                  />
                </div>
                <span className="text-base font-semibold">{adminTitle}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={dataMenu.navMain} onItemClick={onItemClick} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={dataMenu.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
