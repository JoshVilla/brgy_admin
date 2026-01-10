import { connectToDatabase } from "@/lib/mongodb";
import Legislative from "@/models/legislativeModel";
import {
  uploadImageToCloudinary,
  replaceNewImagefromCurrentImage,
  deleteCloudinaryImage,
} from "@/utils/asyncHelpers";
import { getCloudinaryPublicId } from "@/utils/nonAsyncHelpers";

export async function EditLegislativeController(formData: FormData) {
  try {
    await connectToDatabase();

    // Extract ID and fields from FormData
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const legislativeType = formData.get("legislativeType") as string;
    const orderNumber = formData.get("orderNumber") as string;
    const description = formData.get("description") as string;
    const dateApproved = formData.get("dateApproved") as string;
    const effectiveDate = formData.get("effectiveDate") as string;
    const status = formData.get("status") as string;
    const author = formData.get("author") as string;
    const category = formData.get("category") as string;
    const file = formData.get("file") as File | null;

    // Validate required fields
    if (!id || !title || !legislativeType || !orderNumber || !dateApproved) {
      return {
        message: "Missing required fields",
        isSuccess: false,
      };
    }

    // Check if legislative document exists
    const existingLegislative = await Legislative.findById(id);

    if (!existingLegislative) {
      return {
        message: "Legislative document not found",
        isSuccess: false,
      };
    }

    // Check if order number is being changed and if it already exists
    if (orderNumber !== existingLegislative.orderNumber) {
      const isOrderNumberExist = await Legislative.findOne({
        orderNumber,
        _id: { $ne: id }, // Exclude current document
      });

      if (isOrderNumberExist) {
        return {
          message: "Order number already exists",
          isSuccess: false,
        };
      }
    }

    // Prepare update data
    const updateData: any = {
      title,
      legislativeType,
      orderNumber,
      description: description || undefined,
      dateApproved: new Date(dateApproved),
      effectiveDate: effectiveDate ? new Date(effectiveDate) : undefined,
      status: status || "Draft",
      author: author || undefined,
      category: category || undefined,
    };

    // Upload new file if provided
    if (file && file.size > 0) {
      // Delete old file from Cloudinary first
      const existingDoc = await Legislative.findById(id);
      const publicId = getCloudinaryPublicId(existingDoc.file);
      if (publicId) {
        await deleteCloudinaryImage(publicId);
      } else {
        console.warn("No valid Cloudinary public ID found.");
      }
      // Upload new file
      const uploadedFile = await uploadImageToCloudinary(file);

      if (!uploadedFile) {
        return {
          message: "Failed to upload file",
          isSuccess: false,
        };
      }

      updateData.file = uploadedFile;
    }

    // Update legislative document
    const updatedLegislative = await Legislative.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Return updated document
    );

    return {
      message: "Legislative document updated successfully!",
      data: updatedLegislative,
      isSuccess: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Failed to update legislative document.",
      isSuccess: false,
      error: error.message || "An unknown error occurred.",
    };
  }
}
