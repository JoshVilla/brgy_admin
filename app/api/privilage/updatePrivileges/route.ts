import { NextRequest, NextResponse } from "next/server";
import { UpdatePrivilegesController } from "@/controllers/privilage/updatePrivilagesController";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await UpdatePrivilegesController(body);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json({
      isSuccess: false,
      message: "An error occurred while processing your privileges.",
    });
  }
}
