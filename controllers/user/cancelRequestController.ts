// Controller
import Request from "@/models/requestModel";
import { STATUS } from "@/utils/constant";
import { connectToDatabase } from "@/lib/mongodb";
import { deleteCloudinaryImage } from "@/utils/asyncHelpers";

export async function CancelRequestController(params: {
  _id: string;
  status: string;
}) {
  try {
    await connectToDatabase();

    const { _id, status } = params;

    // Validate that status is CANCELLED
    if (status !== STATUS.CANCELLED) {
      return {
        isSuccess: false,
        message: "Invalid status for cancellation",
      };
    }

    // Get the current request
    const currentRequest = await Request.findById(_id);

    if (!currentRequest) {
      return {
        isSuccess: false,
        message: "Request not found",
      };
    }

    // Check if request can be cancelled (not already approved or completed)
    if (currentRequest.status === STATUS.APPROVED) {
      return {
        isSuccess: false,
        message: `Cannot cancel request that is already ${currentRequest.status}`,
      };
    }

    // Delete image from Cloudinary if it exists
    if (currentRequest.imgProof) {
      try {
        const publicId = extractPublicId(currentRequest.imgProof);
        if (publicId) {
          await deleteCloudinaryImage(publicId);
        }
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        // Continue with the update even if image deletion fails
      }
    }

    // Update request status to CANCELLED and clear imgProof
    const updatedRequest = await Request.findByIdAndUpdate(
      _id,
      {
        status: STATUS.CANCELLED,
        imgProof: null,
        reasonOfCancelation: "Cancelled by user",
      },
      { new: true }
    );

    return {
      isSuccess: true,
      message: "Request cancelled successfully",
      data: updatedRequest,
    };
  } catch (error) {
    console.error(error);
    return {
      isSuccess: false,
      message: "Cancellation failed",
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

    return publicId; // Format: brgy_pictures/filename
  } catch (error) {
    console.error("Error extracting publicId:", error);
    return null;
  }
}
