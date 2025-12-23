"use client";

import {
  IconDotsVertical,
  IconLogout,
  // IconNotification, // Not used, can be removed
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
// import { jwtDecode } from "jwt-decode"; // No longer needed
import { useDispatch, useSelector } from "react-redux"; // Import useSelector
import { clearAdmin } from "@/redux/slice/adminSlice"; // Assuming clearAdmin is defined in adminSlice
import { persistor, RootState } from "@/redux/store"; // Import RootState
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { IResAdmin } from "@/utils/types"; // Import IResAdmin type
import { toast } from "sonner";

// Remove TokenInfo as we'll use IResAdmin from Redux
// type TokenInfo = {
//   username: string;
//   isSuperAdmin: boolean;
// };

export function NavUser({
  user, // This 'user' prop might become redundant if all info comes from Redux
}: {
  user: {
    name: string; // This might be replaced by adminInfo.username
    email: string; // This might be replaced by adminInfo.email (if exists)
    avatar: string; // This might be replaced by adminInfo.avatar (if exists)
  };
}) {
  const { isMobile } = useSidebar();
  const dispatch = useDispatch();
  const router = useRouter();

  // --- GET DATA FROM REDUX ---
  const adminInfo = useSelector(
    (state: RootState) => state.admin.adminInfo as IResAdmin | null
  );

  const username = adminInfo?.username || "Guest";
  const isSuperAdmin = adminInfo?.isSuperAdmin || false;

  const handleLogout = async () => {
    try {
      dispatch(clearAdmin());
      await persistor.purge();
      await persistor.flush();
      localStorage.removeItem("token");
      router.push("/");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
      // Optional: Add a toast notification for logout error
    }
  };

  const goToProfile = () => {
    router.push("/admin/profile");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage
                  src={require("@/public/admin_avatar.avif")}
                  alt={username}
                />
                <AvatarFallback className="rounded-lg">
                  {username ? username.charAt(0).toUpperCase() : "CN"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{username}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {isSuperAdmin ? "Super Admin" : "Admin"}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={goToProfile}>
                <User className="mr-2 h-4 w-4" /> {/* Add margin for spacing */}
                My Profile
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout className="mr-2 h-4 w-4" />{" "}
              {/* Add margin for spacing */}
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
