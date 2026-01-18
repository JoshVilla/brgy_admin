import { NextResponse, NextRequest } from "next/server";
import { DeleteIncidentController } from "@/controllers/incident/deleteIncidentController";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    const response = await DeleteIncidentController(id);

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
}
