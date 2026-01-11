import { NextRequest, NextResponse } from "next/server";
import { GetGeneralSettingsController } from "@/controllers/settings/getGeneralSettingsController";

export async function POST() {
  try {
    const response = await GetGeneralSettingsController();

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      isSuccess: false,
      message: "Failed to fetch general settings",
    });
  }
}
