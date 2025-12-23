import { connectToDatabase } from "@/lib/mongodb";
import Request from "@/models/requestModel";
import { STATUS } from "@/utils/constant";

export async function UpdateStatusRequestController(params: {
  _id: string;
  status: string;
  reasonOfCancelation?: string;
}) {
  try {
    await connectToDatabase();

    const { _id, status, reasonOfCancelation } = params;

    const updatePayload: any = { status };
    if (status === STATUS.CANCELLED && reasonOfCancelation) {
      updatePayload.reasonOfCancelation = reasonOfCancelation;
    } else {
      updatePayload.reasonOfCancelation = null;
    }

    const res = await Request.findByIdAndUpdate(_id, updatePayload, {
      new: true,
    });

    return {
      isSuccess: true,
      message: "Request status updated successfully.",
      data: res,
    };
  } catch (error) {
    console.error("Failed to update request status:", error);
    return {
      isSuccess: false,
      message: "Failed to update request status.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
