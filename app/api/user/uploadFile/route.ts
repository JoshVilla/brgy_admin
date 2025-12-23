import { NextResponse, NextRequest } from "next/server";
import { UploadDocumentId } from "@/controllers/user/uploadDocumentId";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const response = await UploadDocumentId(formData);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        message: "Operation Failed. Try Again Later",
        isSuccess: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
