import { NextRequest, NextResponse } from "next/server";
import { GetSettingsController } from "@/controllers/settings/getSettingsController";

export async function POST(req: NextRequest) {
  try {
    const response = await GetSettingsController();

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({
      message: "An error occurred while fetching settings.",
      isSuccess: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
