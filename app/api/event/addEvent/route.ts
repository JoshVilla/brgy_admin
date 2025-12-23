import { NextResponse, NextRequest } from "next/server";
import { AddEventController } from "@/controllers/event/addEventController";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);
    const response = await AddEventController(body);

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Operation Unsuccessfull",
      isSuccess: false,
    });
  }
}
