import { NextResponse, NextRequest } from "next/server";
import { EditOfficialController } from "@/controllers/official/editOfficialController";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const response = await EditOfficialController(formData);

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      isSuccess: false,
      message: "Cannot Edit the Official",
    });
  }
}
