import { NextResponse, NextRequest } from "next/server";
import { AddResidentController } from "@/controllers/resident/addResidentController";
import { IResident } from "@/models/residentModel";

export async function POST(req: NextRequest) {
  try {
    const params = (await req.json()) as IResident;
    const response = await AddResidentController(params);

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Error adding resident. Try Again Later",
      isSuccess: false,
    });
  }
}
