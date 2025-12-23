import { NextResponse, NextRequest } from "next/server";
import { DeleteResidentController } from "@/controllers/resident/deleteResidentController";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    const response = await DeleteResidentController(id);

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Operation Unsuccessfull",
      isSuccess: false,
    });
  }
}
