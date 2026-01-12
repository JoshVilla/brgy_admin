import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { deleteAdmin } from "@/services/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { IResAdmin } from "@/utils/types";
import { toastError, toastSuccess } from "@/utils/helpers";

interface Props {
  id: string;
  refetch: () => void;
  setCurrentPage: (page: number) => void;
}

const DeleteAdmin = ({ id, refetch, setCurrentPage }: Props) => {
  const [openDialog, setOpenDialog] = useState(false);

  const adminInfo = useSelector(
    (state: RootState) => state.admin.adminInfo as IResAdmin
  );

  const deleteMutation = useMutation({
    mutationFn: deleteAdmin,
    onSuccess: (data) => {
      if (data.isSuccess) {
        toastSuccess(data.message);
        setCurrentPage(1);
        refetch();
        setOpenDialog(false);
      } else {
        toastError(data.message);
      }
    },
    onError: () => {
      toastError("Something went wrong while deleting the admin.");
    },
  });

  const handleDelete = () => {
    //check if trying to delete own account
    if (id === adminInfo._id) {
      toastError("Unable to delete own account");
      return;
    } else {
      deleteMutation.mutate({ id });
    }
  };

  // ❌ Block regular admins from deleting
  if (!adminInfo.isSuperAdmin) {
    return (
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogTrigger asChild>
          <Trash2 className="w-4 h-4 text-red-500 cursor-pointer hover:scale-110" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Access Denied</AlertDialogTitle>
            <AlertDialogDescription>
              You are not authorized to perform this action. Please contact a
              super admin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Ok</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
      <AlertDialogTrigger asChild>
        <Trash2 className="w-4 h-4 text-red-500 cursor-pointer hover:scale-110" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the admin
            and remove the record from the server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Yes, I am sure"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAdmin;
