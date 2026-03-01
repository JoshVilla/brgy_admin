import { NextRequest, NextResponse } from "next/server";
import { AddLostAndFound } from "@/controllers/lostandfound/addLostAndFound";


export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const response = await AddLostAndFound(formData);
        return NextResponse.json(response);
    } catch (error: any) {
        return NextResponse.json({
            message: "Operation Unsuccessfull",
            isSuccess: false,
        });
    }
}