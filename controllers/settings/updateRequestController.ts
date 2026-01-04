"use server";

import { connectToDatabase } from "@/lib/mongodb";
import Settings from "@/models/settingsModel";

export const UpdateRequestSettingsController = async (request: any[]) => {
  try {
    await connectToDatabase();

    if (!request || !Array.isArray(request)) {
      return {
        isSuccess: false,
        message: "Invalid request data. Expected an array of request types.",
      };
    }

    // Validate that all request types have required fields
    for (const req of request) {
      if (
        !req.id ||
        !req.name ||
        typeof req.enabled !== "boolean" ||
        typeof req.serviceFee !== "number"
      ) {
        return {
          isSuccess: false,
          message:
            "Invalid request type data. Each request must have id, name, enabled, and serviceFee.",
        };
      }
    }

    const settings = await Settings.findByIdAndUpdate(
      "SYSTEM_SETTINGS",
      { request },
      { new: true, upsert: true, runValidators: true }
    );

    return {
      isSuccess: true,
      message: "Request settings updated successfully",
      data: JSON.parse(JSON.stringify(settings)),
    };
  } catch (error: any) {
    console.error("Error updating request settings:", error);
    return {
      isSuccess: false,
      message: "Failed to update request settings",
      error: error.message,
    };
  }
};
