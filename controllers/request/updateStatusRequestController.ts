// controllers/request/updateStatusRequestController.ts
import { notifyMobile } from "@/lib/socketClient";
import Request from "@/models/requestModel";
import { STATUS } from "@/utils/constant";
import { connectToDatabase } from "@/lib/mongodb";

export async function UpdateStatusRequestController(params: {
  _id: string;
  status: string;
  reasonOfCancelation?: string;
  userAppId: string;
  requestType: string;
}) {
  try {
    await connectToDatabase();

    const { _id, status, reasonOfCancelation, userAppId, requestType } = params;

    const updatePayload: any = { status };
    if (status === STATUS.CANCELLED && reasonOfCancelation) {
      updatePayload.reasonOfCancelation = reasonOfCancelation;
    } else {
      updatePayload.reasonOfCancelation = null;
    }

    const res = await Request.findByIdAndUpdate(_id, updatePayload, {
      new: true,
    });

    // 🔔 Notify mobile user
    notifyMobile({
      userId: userAppId,
      event: "requestStatusUpdated",
      data: {
        _id,
        status,
        requestType,
        reasonOfCancelation: updatePayload.reasonOfCancelation,
        message: `Your request is now ${status}`,
      },
    });

    return { isSuccess: true, message: "Request updated", data: res };
  } catch (error) {
    console.error(error);
    return {
      isSuccess: false,
      message: "Update failed",
      error: (error as Error).message,
    };
  }
}
