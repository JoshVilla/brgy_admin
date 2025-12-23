import React, { useState } from "react";
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
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateStatusAdmin } from "@/services/api";
import { Pencil } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { IResAdmin } from "@/utils/types";

interface Props {
  id: string;
  initialStatus: boolean;
  refetch: () => void;
}

const EditAdminStatus = ({ id, initialStatus, refetch }: Props) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(initialStatus);

  const adminInfo = useSelector(
    (state: RootState) => state.admin.adminInfo as IResAdmin
  );

  const mutation = useMutation({
    mutationFn: updateStatusAdmin,
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success(data.message);
        refetch();
        setOpen(false);
      } else {
        toast.error(data.message || "Failed to update admin status.");
      }
    },
    onError: () => {
      toast.error("Something went wrong. Try again.");
    },
  });

  const handleUpdate = () => {
    mutation.mutate({ id, status: status ? "true" : "false" });
  };

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Admin Role</DialogTitle>
          <DialogDescription>
            Toggle the switch to promote/demote the admin.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 py-4">
          <span className="text-sm font-medium">Super Admin?</span>
          <Switch checked={status} onCheckedChange={setStatus} />
        </div>

        <DialogFooter>
          <Button onClick={handleUpdate} disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAdminStatus;
