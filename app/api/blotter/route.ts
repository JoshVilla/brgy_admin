import { GetAllBlotters } from "@/controllers/blotter/getBlotterController";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await GetAllBlotters(body);
    return response;
  } catch (error) {
    console.error("Error in GET /api/blotter:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
