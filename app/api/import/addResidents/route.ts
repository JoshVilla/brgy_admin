import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { importResidentsController } from "@/controllers/resident/importResidentController";
import { IResResident } from "@/utils/types";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json(
      { message: "No file uploaded", isSuccess: false },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(sheet);

  const result = await importResidentsController(jsonData as IResResident[]);

  return NextResponse.json(result);
}
