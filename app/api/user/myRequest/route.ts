import { NextResponse, NextRequest } from "next/server";
import { MyRequestController } from "@/controllers/user/myRequestController";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await MyRequestController(body);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      message: "Failed to fetch your request",
      isSuccess: false,
      error: error.message || "An unknown error occurred.",
    });
  }
}
