import { NextResponse, NextRequest } from "next/server";
import { UpdateGeneralSettingsController } from "@/controllers/settings/UpdateGeneralSettingsController";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const response = await UpdateGeneralSettingsController(formData);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({
      isSuccess: false,
      message: "Failed to update general settings",
      error: error.message,
    });
  }
}
