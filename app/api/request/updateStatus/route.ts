import { NextRequest, NextResponse } from "next/server";
import { UpdateStatusRequestController } from "@/controllers/request/updateStatusRequestController";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await UpdateStatusRequestController(body);

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
