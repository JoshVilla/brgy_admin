import { connectToDatabase } from "@/lib/mongodb";
import Legislative from "@/models/legislativeModel";
import { uploadImageToCloudinary } from "@/utils/asyncHelpers";

export async function AddLegislativeController(formData: FormData) {
  try {
    await connectToDatabase();

    // Extract fields from FormData
    const title = formData.get("title") as string;
    const legislativeType = formData.get("legislativeType") as string;
    const orderNumber = formData.get("orderNumber") as string;
    const description = formData.get("description") as string;
    const dateApproved = formData.get("dateApproved") as string;
    const effectiveDate = formData.get("effectiveDate") as string;
    const status = formData.get("status") as string;
    const author = formData.get("author") as string;
    const category = formData.get("category") as string;
    const createdBy = formData.get("createdBy") as string;
    const file = formData.get("file") as File;

    // Validate required fields
    if (!title || !legislativeType || !orderNumber || !dateApproved || !file) {
      return {
        message: "Missing required fields",
        isSuccess: false,
      };
    }

    // Check if order number already exists
    const isOrderNumberExist = await Legislative.findOne({ orderNumber });

    if (isOrderNumberExist) {
      return {
        message: "Order number already exists",
        isSuccess: false,
      };
    }

    // Upload file to Cloudinary
    const uploadedFile = await uploadImageToCloudinary(file);

    if (!uploadedFile) {
      return {
        message: "Failed to upload file",
        isSuccess: false,
      };
    }

    // Create new legislative document
    const newLegislative = await Legislative.create({
      title,
      legislativeType,
      orderNumber,
      file: uploadedFile, // Cloudinary URL
      description: description || undefined,
      dateApproved: new Date(dateApproved),
      effectiveDate: effectiveDate ? new Date(effectiveDate) : undefined,
      status: status || "Draft",
      author: author || undefined,
      category: category || undefined,
      createdBy: createdBy || undefined,
    });

    return {
      message: "Legislative document added successfully!",
      data: newLegislative,
      isSuccess: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Failed to add legislative document.",
      isSuccess: false,
      error: error.message || "An unknown error occurred.",
    };
  }
}
