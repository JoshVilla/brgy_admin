import { connectToDatabase } from "@/lib/mongodb";
import IncidentReport from "@/models/incidentModel";
import { uploadImageToCloudinary } from "@/utils/asyncHelpers";

export async function AddIncidentReportController(formData: FormData) {
  try {
    await connectToDatabase();

    // Extract form fields
    const incidentType = formData.get("incidentType") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const dateOccurred = formData.get("dateOccurred") as string;
    const reporterName = formData.get("reporterName") as string;
    const reporterContact = formData.get("reporterContact") as string;

    // Validate required fields
    if (
      !incidentType ||
      !description ||
      !location ||
      !dateOccurred ||
      !reporterName ||
      !reporterContact
    ) {
      throw new Error("All required fields must be filled");
    }

    // Handle image uploads (max 5)
    const imageUrls: string[] = [];
    const images = formData.getAll("images") as File[];

    if (images.length > 5) {
      throw new Error("Maximum 5 images allowed");
    }

    // Upload each image to Cloudinary
    for (const file of images) {
      if (file && file instanceof File && file.size > 0) {
        const imageUrl = await uploadImageToCloudinary(file);
        imageUrls.push(imageUrl);
      }
    }

    // Generate reference number
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    // Count incidents for this month
    const count = await IncidentReport.countDocuments({
      createdAt: {
        $gte: new Date(year, date.getMonth(), 1),
        $lt: new Date(year, date.getMonth() + 1, 1),
      },
    });

    const referenceNumber = `IR-${year}${month}-${String(count + 1).padStart(4, "0")}`;

    // Create incident report
    const newIncidentReport = await IncidentReport.create({
      referenceNumber,
      incidentType,
      description,
      location,
      dateOccurred: new Date(dateOccurred),
      reporterName,
      reporterContact,
      status: "pending",
      images: imageUrls,
    });

    return {
      isSuccess: true,
      message: "Incident report submitted successfully",
      data: newIncidentReport,
    };
  } catch (error) {
    console.error("Error creating incident report:", error);
    throw error;
  }
}
