import { connectToDatabase } from "@/lib/mongodb";
import Resident from "@/models/residentModel";
import { IResResident } from "@/utils/types";
import { format } from "date-fns";

export async function importResidentsController(data: IResResident[]) {
  try {
    await connectToDatabase();

    // Function to parse Excel date (string or numeric)
    const parseExcelDate = (date: string | number) => {
      if (typeof date === "number") {
        // Excel stores days since 1900-01-01
        const excelEpoch = new Date(1899, 11, 30);
        return new Date(excelEpoch.getTime() + date * 24 * 60 * 60 * 1000);
      }
      return new Date(date);
    };

    // Skip first row (sample row)
    const realData = data.slice(1);

    const residents = realData.map((res) => {
      const birthdate = parseExcelDate(res.birthdate); // ✅ use parsed date

      return {
        firstname: res.firstname,
        middlename: res.middlename,
        lastname: res.lastname,
        suffix: res.suffix || "",
        gender: res.gender,
        purok: res.purok,
        isSeniorCitizen: String(res.isSeniorCitizen).toUpperCase() === "TRUE",
        isPwd: String(res.isPwd).toUpperCase() === "TRUE",
        birthdate: format(birthdate, "MMMM d, yyyy"), // ✅ formatted string
      };
    });

    const inserted = await Resident.insertMany(residents);

    return {
      message: `${inserted.length} residents added successfully.`,
      data: inserted,
      isSuccess: true,
    };
  } catch (error) {
    console.error("Import failed:", error);
    return {
      message: `Failed to import residents. ${error}`,
      isSuccess: false,
    };
  }
}
