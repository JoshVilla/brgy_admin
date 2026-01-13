import { NextRequest, NextResponse } from "next/server";
import { UpdateStatusRequestController } from "@/controllers/request/updateStatusRequestController";

export async function POST(req: NextRequest) {
  try {
    const userName = req.headers.get("x-User-name") || "Unknown User";
    const body = await req.json();

    const response = await UpdateStatusRequestController(body, userName);

    return NextResponse.json(response);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({
      message: "Operation failed.",
      isSuccess: false,
      error: error.message,
    });
  }
}
