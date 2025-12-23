import { NextRequest, NextResponse } from "next/server";
import { DeleteEventController } from "@/controllers/event/deleteEventController";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    const response = await DeleteEventController(id);

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Unsuccessfull operation!",
      isSuccess: true,
      error: error,
    });
  }
}
