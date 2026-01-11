import { NextResponse, NextRequest } from "next/server";
import { EditEventController } from "@/controllers/event/editEventController";

export async function POST(req: NextRequest) {
  try {
    const userName = req.headers.get("x-user-name") || "Unknown User";
    const params = await req.json();
    const response = await EditEventController(params, userName);

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
