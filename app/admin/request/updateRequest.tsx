import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IResRequest } from "@/utils/types";
import { Textarea } from "@/components/ui/textarea";
import { STATUS } from "@/utils/constant";
import { useMutation } from "@tanstack/react-query";
import { updateStatusRequest } from "@/services/api";
import { toast } from "sonner";
import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { calculateAge } from "@/utils/helpers";
interface Props {
  record: IResRequest;
  refetch: () => void;
}

const UpdateRequest = ({ record, refetch }: Props) => {
  const [status, setStatus] = useState(record.status || "");
  const [reasonOfCancellation, setReasonOfCancellation] = useState("");

  const updateMutation = useMutation({
    mutationFn: updateStatusRequest,
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success(data.message);
        refetch();
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Something went wrong.");
    },
  });

  const handleChange = () => {
    if (status === STATUS.CANCELLED && !reasonOfCancellation.trim()) {
      toast.error("Please provide a reason for cancellation.");
      return;
    }

    const payload: {
      _id: string;
      status: string;
      reasonOfCancelation?: string;
    } = {
      _id: record._id,
      status,
    };

    if (status === STATUS.CANCELLED) {
      payload.reasonOfCancelation = reasonOfCancellation.trim();
    }

    updateMutation.mutate(payload);
  };

  useEffect(() => {
    setStatus(record.status);
  }, [record]);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setStatus(record.status);
          setReasonOfCancellation("");
        }
      }}
    >
      <form>
        <DialogTrigger asChild>
          <PenLine
            width={16}
            height={16}
            className="text-sky-400 cursor-pointer scale-110"
          />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <div>Resident's Information</div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium">Name</div>
                  <div className="text-sm text-gray-600">
                    {`${record?.resident?.firstname} ${record?.resident?.middlename} ${record?.resident?.lastname}`}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium">Gender</div>
                  <div className="text-sm text-gray-600">
                    {record?.resident?.gender}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium">Age</div>
                  <div className="text-sm text-gray-600">
                    {calculateAge(record?.resident?.birthdate)}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Reason</div>
              <div className="text-sm text-gray-600">{record.reason}</div>
            </div>

            <div>
              <div className="text-sm font-medium">Proof of Identity</div>
              <Zoom>
                {" "}
                <Image
                  src={record?.imgProof || "Image_not_available.png"}
                  width={200}
                  height={200}
                  alt="img proof"
                />
              </Zoom>
            </div>
            <div className="grid gap-3">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(val: any) => setStatus(val)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {status === STATUS.CANCELLED && (
                <div className="space-y-2">
                  <Label>Reason of cancellation</Label>
                  <Textarea
                    placeholder="Enter your reason"
                    value={reasonOfCancellation}
                    onChange={(e) => setReasonOfCancellation(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              size="sm"
              onClick={handleChange}
              disabled={updateMutation.isPending}
              className="cursor-pointer"
            >
              {updateMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default UpdateRequest;
