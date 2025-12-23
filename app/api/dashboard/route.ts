import { NextResponse, NextRequest } from "next/server";
import { GetTotalCountsController } from "@/controllers/dashboard/countDisplay";

export async function POST(req: NextRequest) {
  try {
    const response = await GetTotalCountsController();

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      {
        message: "Error fetching data. Try Again Later",
        isSuccess: false,
      },
      { status: 500 }
    );
  }
}
