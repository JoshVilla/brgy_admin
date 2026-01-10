import { NextResponse, NextRequest } from "next/server";
import { AddLegislativeController } from "@/controllers/legislative/addLegislativeController";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Call the controller to process the form data
    const response = await AddLegislativeController(formData);

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Operation Unsuccessfull",
      isSuccess: false,
    });
  }
}
