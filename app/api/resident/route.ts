import { NextRequest, NextResponse } from "next/server";
import { ResidentController } from "@/controllers/resident/getResidentController";

export async function POST(req: NextRequest) {
  try {
    const { page = 1, limit = 10, ...filters } = await req.json();

    const response = await ResidentController({ page, limit, filters });
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching residents:", error);
    return NextResponse.json(
      {
        message: "Error fetching data. Try Again Later",
        isSuccess: false,
      },
      { status: 500 }
    );
  }
}
