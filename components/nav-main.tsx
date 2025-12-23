"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import React from "react";

interface NavMainProps {
  items: {
    title: string;
    url: string;
    icon?: any;
  }[];
  onItemClick?: () => void; // callback for mobile auto-close
}

export function NavMain({ items, onItemClick }: NavMainProps) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link
                  href={item.url}
                  onClick={() => {
                    if (onItemClick) {
                      onItemClick();
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  {item.icon && <item.icon className="!size-4" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
