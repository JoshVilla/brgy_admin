import { NextResponse, NextRequest } from "next/server";
import { RegisterController } from "@/controllers/user/registerController";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await RegisterController(body);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      message: "Failed to create an account",
      isSuccess: false,
      error: error.message || "An unknown error occured.",
    });
  }
}
