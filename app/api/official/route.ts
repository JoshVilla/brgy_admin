import { NextResponse, NextRequest } from "next/server";
import { GetOfficialsController } from "@/controllers/official/getOfficialsController";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    const response = await GetOfficialsController(id);

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      isSuccess: false,
      message: "Cannot fetch barangay officials",
    });
  }
}
