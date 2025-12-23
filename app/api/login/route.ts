import { NextResponse, NextRequest } from "next/server";
import { LoginAdminController } from "@/controllers/admin/loginAdminController";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await LoginAdminController(body);

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "There was a problem when logging in, Try again later",
      isSuccess: false,
    });
  }
}
