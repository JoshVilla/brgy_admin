import { NextResponse, NextRequest } from "next/server";
import { EditEventController } from "@/controllers/event/editEventController";

export async function POST(req: NextRequest) {
  try {
    const params = await req.json();
    const response = await EditEventController(params);

    return NextResponse.json(response);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({
      message: "Operation Unsuccessful",
      isSuccess: false,
      error: error.message,
    });
  }
}
