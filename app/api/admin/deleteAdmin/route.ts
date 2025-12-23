import { NextResponse, NextRequest } from "next/server";
import { DeleteAdminController } from "@/controllers/admin/deleteAdminController";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    const response = await DeleteAdminController(id);

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Operation Unsuccessfull",
      isSuccess: false,
    });
  }
}
