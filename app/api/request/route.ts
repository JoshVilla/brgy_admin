import { NextResponse, NextRequest } from "next/server";
import { GetRequestController } from "@/controllers/request/getRequestController";

export async function POST(req: NextRequest) {
  try {
    const { page = 1, limit = 10, ...filters } = await req.json();

    const response = await GetRequestController({
      page,
      limit,
      filters,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json({
      isSuccess: false,
      message: "An error occurred while processing your request.",
    });
  }
}
