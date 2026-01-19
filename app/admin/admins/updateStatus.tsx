import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  updateStatusAdmin,
  getPrivilages,
  updatePrivilages,
} from "@/services/api";
import { Pencil } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { IResAdmin } from "@/utils/types";
import { toastError, toastSuccess, toastWarning } from "@/utils/helpers";

interface Props {
  id: string;
  initialStatus: boolean; // isSuperAdmin: true or false
  refetch: () => void;
}

interface IPrivilege {
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
  activitylog: number;
  incident: number;
  lostandfound: number;
}

const privilegeOptions = [
  { key: "dashboard" as keyof IPrivilege, label: "Dashboard" },
  { key: "resident" as keyof IPrivilege, label: "Resident Management" },
  { key: "announcement" as keyof IPrivilege, label: "Announcements" },
  { key: "event" as keyof IPrivilege, label: "Events" },
  { key: "request" as keyof IPrivilege, label: "Requests" },
  { key: "blotter" as keyof IPrivilege, label: "Blotters" },
  { key: "analytic" as keyof IPrivilege, label: "Analytics" },
  { key: "legislative" as keyof IPrivilege, label: "Legislatives" },
  { key: "admin" as keyof IPrivilege, label: "Admins" },
  { key: "official" as keyof IPrivilege, label: "Brgy Officials" },
  { key: "setting" as keyof IPrivilege, label: "Settings" },
  { key: "activitylog" as keyof IPrivilege, label: "Activity Logs" },
  { key: "incident" as keyof IPrivilege, label: "Incident Reports" },
  { key: "lostandfound" as keyof IPrivilege, label: "Lost and Found" },
];

const EditAdminStatus = ({ id, initialStatus, refetch }: Props) => {
  const [open, setOpen] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(initialStatus);
  const [privileges, setPrivileges] = useState<IPrivilege>({
    dashboard: 0,
    resident: 0,
    announcement: 0,
    event: 0,
    request: 0,
    blotter: 0,
    analytic: 0,
    legislative: 0,
    admin: 0,
    official: 0,
    setting: 0,
    activitylog: 0,
    incident: 0,
    lostandfound: 0,
  });

  const adminInfo = useSelector(
    (state: RootState) => state.admin.adminInfo as IResAdmin,
  );

  // Fetch privileges when dialog opens
  const { data: privilegeData, refetch: refetchPrivileges } = useQuery({
    queryKey: ["admin-privileges", id],
    queryFn: () => getPrivilages({ adminId: id }),
    enabled: open && adminInfo.isSuperAdmin,
  });

  // Update local state when privileges are fetched
  useEffect(() => {
    if (privilegeData?.data) {
      const {
        dashboard,
        resident,
        announcement,
        event,
        request,
        blotter,
        analytic,
        legislative,
        admin,
        official,
        setting,
        activitylog,
        incident,
        lostandfound,
      } = privilegeData.data;

      setPrivileges({
        dashboard,
        resident,
        announcement,
        event,
        request,
        blotter,
        analytic,
        legislative,
        admin,
        official,
        setting,
        activitylog,
        incident,
        lostandfound,
      });
    }
  }, [privilegeData]);

  // Reset isSuperAdmin when dialog opens
  useEffect(() => {
    if (open) {
      setIsSuperAdmin(initialStatus);
    }
  }, [open, initialStatus]);

  // Count enabled privileges
  const enabledPrivilegesCount = Object.values(privileges).filter(
    (value) => value === 1,
  ).length;

  // Check if at least one privilege is enabled
  const hasMinimumPrivileges = enabledPrivilegesCount >= 1;

  // Mutation for updating super admin status
  const statusMutation = useMutation({
    mutationFn: updateStatusAdmin,
    onSuccess: (data) => {
      if (data.isSuccess) {
        toastSuccess(data.message);
        refetch();
      } else {
        toastError(data.message || "Failed to update admin status.");
      }
    },
    onError: () => {
      toastError("Something went wrong. Try again.");
    },
  });

  // Mutation for updating privileges
  const privilegeMutation = useMutation({
    mutationFn: updatePrivilages,
    onSuccess: (data) => {
      if (data.isSuccess) {
        toastSuccess("Privileges updated successfully!");
        refetch();
        refetchPrivileges();
      } else {
        toastError(data.message || "Failed to update privileges.");
      }
    },
    onError: () => {
      toastError("Something went wrong. Try again.");
    },
  });

  // Auto-save when Super Admin status changes
  const handleStatusChange = async (newStatus: boolean) => {
    setIsSuperAdmin(newStatus);

    // Update Super Admin status
    const statusResult = await statusMutation.mutateAsync({
      id,
      status: newStatus ? "true" : "false",
    });

    // If promoted to Super Admin, set all privileges to 1
    if (statusResult.isSuccess && newStatus) {
      const allPrivileges: IPrivilege = {
        dashboard: 1,
        resident: 1,
        announcement: 1,
        event: 1,
        request: 1,
        blotter: 1,
        analytic: 1,
        legislative: 1,
        admin: 1,
        official: 1,
        setting: 1,
        activitylog: 1,
        incident: 1,
        lostandfound: 1,
      };

      setPrivileges(allPrivileges);

      // Save all privileges
      await privilegeMutation.mutateAsync({
        adminId: id,
        ...allPrivileges,
      });
    }

    // If demoted from Super Admin, keep current privileges (or set to dashboard only)
    if (statusResult.isSuccess && !newStatus) {
      // Option 1: Keep current privileges as they are
      // Do nothing, privileges remain as is
      // Option 2: Set only dashboard to 1, rest to 0
      // const dashboardOnly: IPrivilege = {
      //   dashboard: 1,
      //   resident: 0,
      //   announcement: 0,
      //   event: 0,
      //   request: 0,
      //   blotter: 0,
      //   analytic: 0,
      //   legislative: 0,
      //   admin: 0,
      //   official: 0,
      //   setting: 0,
      // };
      // setPrivileges(dashboardOnly);
      // await privilegeMutation.mutateAsync({
      //   adminId: id,
      //   ...dashboardOnly,
      // });
    }
  };

  const handlePrivilegeToggle = (key: keyof IPrivilege) => {
    const newValue = privileges[key] === 1 ? 0 : 1;

    // If trying to uncheck and it's the last privilege, prevent it
    if (newValue === 0 && enabledPrivilegesCount === 1) {
      toastWarning("At least one privilege must be enabled");
      return;
    }

    setPrivileges((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const handleSavePrivileges = () => {
    // Validate at least one privilege is enabled
    if (!hasMinimumPrivileges) {
      toastWarning("Please enable at least one privilege");
      return;
    }

    privilegeMutation.mutate({
      adminId: id,
      ...privileges,
    });
  };

  // Get displayed privileges (all 1s if super admin, else actual privileges)
  const displayedPrivileges = isSuperAdmin
    ? Object.keys(privileges).reduce((acc, key) => {
        acc[key as keyof IPrivilege] = 1;
        return acc;
      }, {} as IPrivilege)
    : privileges;

  if (!adminInfo.isSuperAdmin) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Pencil className="w-4 h-4 text-sky-500 cursor-pointer hover:scale-110" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Access Denied</DialogTitle>
            <DialogDescription>
              You are not authorized to edit admin status. Only Super Admins can
              perform this action.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Pencil className="w-4 h-4 text-sky-500 cursor-pointer hover:scale-110" />
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Admin Role & Privileges</DialogTitle>
          <DialogDescription>
            Manage admin role and access permissions.
          </DialogDescription>
        </DialogHeader>

        {/* Super Admin Toggle */}
        <div className="space-y-4">
          <div className="flex items-center justify-between py-4">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Super Admin</Label>
              <p className="text-sm text-muted-foreground">
                Super Admins have full access to all features
              </p>
            </div>
            <Switch
              checked={isSuperAdmin}
              onCheckedChange={handleStatusChange}
              disabled={statusMutation.isPending || privilegeMutation.isPending}
            />
          </div>

          <Separator />

          {/* Privileges Section */}
          <div className="space-y-4">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">
                Access Privileges
              </Label>
              <p className="text-sm text-muted-foreground">
                Select which sections this admin can access (minimum 1 required)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
              {privilegeOptions.map((option) => (
                <div
                  key={option.key}
                  className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-accent transition-colors"
                >
                  <Checkbox
                    id={option.key}
                    checked={displayedPrivileges[option.key] === 1}
                    onCheckedChange={() => handlePrivilegeToggle(option.key)}
                    disabled={isSuperAdmin} // Disable if Super Admin
                  />
                  <Label
                    htmlFor={option.key}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>

            {isSuperAdmin ? (
              <p className="text-sm text-muted-foreground italic">
                * Super Admins automatically have access to all sections
              </p>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Selected privileges: {enabledPrivilegesCount} /{" "}
                  {privilegeOptions.length}
                </p>
                {!hasMinimumPrivileges && (
                  <span className="text-sm text-destructive font-medium">
                    (At least 1 required)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={privilegeMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSavePrivileges}
            disabled={
              privilegeMutation.isPending ||
              isSuperAdmin ||
              !hasMinimumPrivileges
            }
          >
            {privilegeMutation.isPending ? "Saving..." : "Save Privileges"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAdminStatus;
