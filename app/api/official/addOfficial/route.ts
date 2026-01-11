import { NextRequest, NextResponse } from "next/server";
import { AddOfficialController } from "@/controllers/official/addOfficialController";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData(); // Add await
    const response = await AddOfficialController(formData); // Add await

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Cannot Add Barangay Official",
      isSuccess: false,
    });
  }
}
