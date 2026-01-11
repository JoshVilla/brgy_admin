import { NextResponse, NextRequest } from "next/server";
import { GetActivityLogsController } from "@/controllers/activitylog/getActivityLogsContropller";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await GetActivityLogsController(body);

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      isSuccess: false,
      message: "Cannot fetch activity logs",
    });
  }
}
