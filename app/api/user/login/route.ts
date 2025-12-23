import { NextResponse, NextRequest } from "next/server";
import { LoginController } from "@/controllers/user/loginController";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await LoginController(body);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      message: "Failed to login",
      isSuccess: false,
      error: error.message || "An unknown error occurred.",
    });
  }
}
