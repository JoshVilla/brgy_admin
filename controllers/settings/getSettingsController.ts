"use server";

import { connectToDatabase } from "@/lib/mongodb";
import Settings from "@/models/settingsModel";

/**
 * Get system settings (singleton)
 */
export const GetSettingsController = async () => {
  try {
    await connectToDatabase();
    let settings = await Settings.findById("SYSTEM_SETTINGS");

    // If settings don't exist, create default settings
    if (!settings) {
      settings = await Settings.create({ _id: "SYSTEM_SETTINGS" });
    }

    return {
      isSuccess: true,
      data: JSON.parse(JSON.stringify(settings)), // Convert Mongoose document to plain object
    };
  } catch (error: any) {
    console.error("Error fetching settings:", error);
    return {
      isSuccess: false,
      message: "Failed to fetch settings",
      error: error.message,
    };
  }
};
