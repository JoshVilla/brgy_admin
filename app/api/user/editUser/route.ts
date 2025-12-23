import { NextResponse, NextRequest } from "next/server";
import { EditUserController } from "@/controllers/user/editUserController";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await EditUserController(body);
    return NextResponse.json(response);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({
      message: "Operation Failed. Try Again Later",
      isSuccess: false,
      error: error.message,
    });
  }
}
