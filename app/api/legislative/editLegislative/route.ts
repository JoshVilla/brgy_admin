// app/api/legislative/editLegislative/route.ts
import { NextResponse, NextRequest } from "next/server";
import { EditLegislativeController } from "@/controllers/legislative/editLegislativeController";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const response = await EditLegislativeController(formData);

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Cannot edit the legislative",
      isSuccess: false,
    });
  }
}
