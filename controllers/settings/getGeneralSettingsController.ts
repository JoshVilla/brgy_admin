import { connectToDatabase } from "@/lib/mongodb";
import Settings from "@/models/settingsModel";

export async function GetGeneralSettingsController() {
  try {
    await connectToDatabase();

    const settings = await Settings.findById("SYSTEM_SETTINGS").select(
      "general"
    );

    if (!settings) {
      return {
        message: "General Setting not found",
        isSuccess: false,
      };
    }

    return {
      isSuccess: true,
      general: settings.general,
    };
  } catch (error: any) {
    console.error("Error fetching settings:", error);
    return {
      isSuccess: false,
      message: "Failed to fetch general settings",
      error: error.message,
    };
  }
}
