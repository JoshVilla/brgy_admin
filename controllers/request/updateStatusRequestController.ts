// controllers/request/updateStatusRequestController.ts
import { notifyMobile } from "@/lib/socketClient";
import Request from "@/models/requestModel";
import { STATUS } from "@/utils/constant";
import { connectToDatabase } from "@/lib/mongodb";
import { deleteCloudinaryImage } from "@/utils/asyncHelpers";

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

    let res;

    if (status === STATUS.CANCELLED || status === STATUS.APPROVED) {
      // Get the current request to retrieve imgProof
      const currentRequest = await Request.findById(_id);

      // Delete image from Cloudinary if it exists
      if (currentRequest?.imgProof) {
        try {
          // Extract publicId from the imgProof URL
          const publicId = extractPublicId(currentRequest.imgProof);
          if (publicId) {
            await deleteCloudinaryImage(publicId);
          }
        } catch (error) {
          console.error("Error deleting image from Cloudinary:", error);
          // Continue with the update even if image deletion fails
        }
      }

      // Update request and clear imgProof
      res = await Request.findByIdAndUpdate(
        _id,
        {
          ...updatePayload,
          imgProof: null,
        },
        { new: true }
      );
    } else {
      // For other status updates, don't touch imgProof
      res = await Request.findByIdAndUpdate(_id, updatePayload, {
        new: true,
      });
    }

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

// Helper function to extract publicId from Cloudinary URL
function extractPublicId(imageUrl: string): string | null {
  if (!imageUrl) return null;

  // If it's already just a publicId with folder, return it
  if (!imageUrl.includes("cloudinary.com")) {
    return imageUrl;
  }

  // Extract publicId from full Cloudinary URL
  // Example: https://res.cloudinary.com/demo/image/upload/v1234567/brgy_pictures/image.jpg
  // Should return: brgy_pictures/image
  try {
    const parts = imageUrl.split("/upload/");
    if (parts.length < 2) return null;

    const pathAfterUpload = parts[1];

    // Remove version number (v1234567) if present
    const pathWithoutVersion = pathAfterUpload.replace(/^v\d+\//, "");

    // Remove file extension
    const lastDotIndex = pathWithoutVersion.lastIndexOf(".");
    const publicId =
      lastDotIndex > 0
        ? pathWithoutVersion.substring(0, lastDotIndex)
        : pathWithoutVersion;

    return publicId; // This will be in format: brgy_pictures/filename
  } catch (error) {
    console.error("Error extracting publicId:", error);
    return null;
  }
}
