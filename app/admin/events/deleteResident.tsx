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
import { deleteEvent } from "@/services/api";
import { toastError, toastSuccess } from "@/utils/helpers";

interface Props {
  id: string;
  refetch: () => void;
  setCurrentPage: (page: number) => void;
}
const DeleteEvent = ({ id, refetch, setCurrentPage }: Props) => {
  const [openDialog, setOpenDialog] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
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
    onError: (error) => {
      console.log(error);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate({ id });
  };
  return (
    <AlertDialog open={openDialog} onOpenChange={(open) => setOpenDialog(open)}>
      <AlertDialogTrigger asChild>
        <Trash2 className="w-4 h-4 text-red-500 cursor-pointer hover:scale-110" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete data and
            remove from the servers.
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

export default DeleteEvent;
