import { NextRequest, NextResponse } from "next/server";
import { EditResidentController } from "@/controllers/resident/editResident";

export async function POST(req: NextRequest) {
  try {
    const params = await req.json();
    const response = await EditResidentController(params);

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Operation Unsuccessfull!",
      isSuccess: false,
    });
  }
}
