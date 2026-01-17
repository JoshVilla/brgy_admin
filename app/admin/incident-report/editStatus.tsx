import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import React, { useState } from "react";
import { IResIncidentReport } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import { updateStatusIncidentReport } from "@/services/api";
import { toastError, toastSuccess } from "@/utils/helpers";

interface Props {
  records: IResIncidentReport;
  refetch: () => void;
}

const EditStatus = ({ records, refetch }: Props) => {
  const [status, setStatus] = useState<string>(records.status);
  const [open, setOpen] = useState(false);

  const updateMutation = useMutation({
    mutationFn: updateStatusIncidentReport,
    onSuccess: (data) => {
      if (data.isSuccess) {
        toastSuccess(data.message);
        setOpen(false);
        refetch();
      } else {
        toastError(data.message);
      }
    },
    onError: () => {
      toastError("Failed to update status");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      _id: records._id,
      status,
    };
    updateMutation.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Pencil className="w-4 h-4 text-blue-500 cursor-pointer hover:scale-110" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Status</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStatus;
