import { SampleController } from "@/controllers/sample/sampleController";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const response = await SampleController();

    return NextResponse.json(response);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      message: "Failed to sample",
      isSuccess: false,
      error: error.message || "An unknown error occurred.",
    });
  }
}
