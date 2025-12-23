import { connectToDatabase } from "@/lib/mongodb";
import Request from "@/models/requestModel";
import { uploadImageToCloudinary } from "@/utils/asyncHelpers";

export async function AddRequestController(formdata: FormData) {
  try {
    await connectToDatabase();

    const name = formdata.get("name") as string;
    const reason = formdata.get("reason") as string;
    const type = Number(formdata.get("type"));
    const userId = formdata.get("userId") as string;
    const file = formdata.get("fileName") as File | null;
    const isVerified = formdata.get("isVerified") === "true";

    const useExistingProof = formdata.get("useExistingProof") === "true";
    const existingProofUrl = formdata.get("existingProofUrl") as string;

    // Validate required fields
    if (!name || !reason || !userId || isNaN(type)) {
      return {
        isSuccess: false,
        message: "Missing required fields",
      };
    }

    let imgProof: string | null = null;

    if (file && file instanceof File) {
      imgProof = await uploadImageToCloudinary(file);
    } else if (useExistingProof && existingProofUrl) {
      imgProof = existingProofUrl;
    }

    const newRequest = await Request.create({
      name,
      reason,
      type,
      userId,
      isVerified,
      imgProof,
    });

    return {
      isSuccess: true,
      message: "Request has been submitted successfully",
      data: newRequest,
    };
  } catch (error) {
    console.error("AddRequestController Error:", error);
    return {
      isSuccess: false,
      message: "An error occurred while submitting the request.",
    };
  }
}
