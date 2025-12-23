import { NextResponse, NextRequest } from "next/server";
import { AddAdminController } from "@/controllers/admin/addAdminController";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await AddAdminController(body);

    return NextResponse.json(response);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({
      message: "Failed to add resident.",
      isSuccess: false,
      error: error.message || "An unknown error occurred.",
    });
  }
}
