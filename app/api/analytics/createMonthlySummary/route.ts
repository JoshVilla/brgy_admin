import { NextRequest, NextResponse } from "next/server";
import { CreateMonthlySummaryController } from "@/controllers/analytics/createMonthlySummaryController";

export async function POST(req: NextRequest) {
  try {
    const response = await CreateMonthlySummaryController();

    const statusCode = response.isSuccess ? 200 : 400;

    return NextResponse.json(response, { status: statusCode });
  } catch (error: any) {
    console.error("Monthly Summary API Error:", error);
    return NextResponse.json(
      {
        message: "An error occurred while creating the monthly summary.",
        data: null,
        isSuccess: false,
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
