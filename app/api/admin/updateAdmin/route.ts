import { NextRequest, NextResponse } from "next/server";
import { UpdateStatusController } from "@/controllers/admin/updateStatusController";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await UpdateStatusController(body);

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
