import { NextRequest, NextResponse } from "next/server";
import { DeleteLegislativeController } from "@/controllers/legislative/deleteLegislativeController";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    const response = await DeleteLegislativeController(id);

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Cannot delete the legislative",
      isSuccess: false,
    });
  }
}
