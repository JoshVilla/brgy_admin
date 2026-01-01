import { NextResponse, NextRequest } from "next/server";
import { ResidentGraphController } from "@/controllers/analytics/residentGraphController";

export async function POST() {
  try {
    const response = await ResidentGraphController();

    return NextResponse.json(response);
  } catch (error: any) {
    console.error(error);
    return {
      message: "An error occurred while fetching the data.",
      data: null,
      isSuccess: false,
      error: error.message || "Unknown error",
    };
  }
}
