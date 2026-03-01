import React, { useState } from 'react'
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
import { PenIcon } from "lucide-react";
const UpdateStatus = () => {
    const [openDialog, setOpenDialog] = useState(false);
  return (
    <AlertDialog open={openDialog} onOpenChange={(open) => setOpenDialog(open)}>
        <AlertDialogTrigger asChild>
            <PenIcon onClick={() => setOpenDialog(true)} className="w-4 h-4 text-blue-500 cursor-pointer hover:scale-110"/>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Update Status</AlertDialogTitle>
                <AlertDialogDescription>
                    Update the status of the lost and found item
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Update</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default UpdateStatus