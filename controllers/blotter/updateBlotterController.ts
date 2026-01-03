// controllers/blotter/updateBlotterController.ts
import { connectToDatabase } from "@/lib/mongodb";
import Blotter from "@/models/blotterModel";

interface UpdateBlotterData {
  id: string;
  incidentType: string;
  incidentDate: string;
  location: string;
  complainantName: string;
  respondentName: string;
  narrative: string;
  status: "ONGOING" | "FOR_HEARING" | "SETTLED" | "REFERRED";
  officerInCharge: string;
}

// controllers/blotter/updateBlotterController.ts
export async function UpdateBlotter(id: string, data: UpdateBlotterData) {
  try {
    await connectToDatabase();

    const blotter = await Blotter.findByIdAndUpdate(
      id,
      {
        $set: {
          incidentType: data.incidentType,
          incidentDate: data.incidentDate,
          location: data.location,
          complainantName: data.complainantName,
          respondentName: data.respondentName,
          narrative: data.narrative,
          status: data.status,
          officerInCharge: data.officerInCharge,
        },
      },
      { new: true, runValidators: true }
    ).lean();

    if (!blotter) {
      return {
        isSuccess: false, // Changed from isSuccess
        error: "Blotter not found",
        status: 404,
      };
    }

    return {
      isSuccess: true, // Changed from isSuccess
      data: blotter,
      message: "Blotter entry updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating blotter:", error);

    if (error.name === "ValidationError") {
      const errors: any = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });

      return {
        isSuccess: false, // Changed from isSuccess
        error: "Validation failed",
        errors,
        status: 400,
      };
    }

    return {
      success: false,
      error: "Failed to update blotter entry",
      status: 500,
    };
  }
}
