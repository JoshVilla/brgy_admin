import { NextRequest, NextResponse } from "next/server";
import { GetMonthlySummaryController } from "@/controllers/analytics/getMonthlySummaryController";

export async function POST(req: NextRequest) {
  try {
    const { year, month } = await req.json();

    // Validate inputs
    if (!year || !month) {
      return NextResponse.json(
        {
          message: "Year and month are required.",
          data: null,
          isSuccess: false,
          error: "Missing parameters",
        },
        { status: 400 }
      );
    }

    const response = await GetMonthlySummaryController({
      year: parseInt(year),
      month: parseInt(month),
    });

    const statusCode = response.isSuccess ? 200 : 404;

    return NextResponse.json(response, { status: statusCode });
  } catch (error: any) {
    console.error("Get Monthly Summary API Error:", error);
    return NextResponse.json(
      {
        message: "An error occurred while fetching the monthly summary.",
        data: null,
        isSuccess: false,
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
