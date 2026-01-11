import { NextResponse, NextRequest } from "next/server";
import { DeleteAdminController } from "@/controllers/admin/deleteAdminController";

export async function POST(req: NextRequest) {
  try {
    const userName = req.headers.get("x-user-name") || "Unknown User";
    const { id } = await req.json();
    const response = await DeleteAdminController(id, userName);

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Operation Unsuccessfull",
      isSuccess: false,
    });
  }
}
