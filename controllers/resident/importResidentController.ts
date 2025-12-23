import { connectToDatabase } from "@/lib/mongodb";
import Resident from "@/models/residentModel";
import { IResResident } from "@/utils/types";
import { format } from "date-fns";
export async function importResidentsController(data: IResResident[]) {
  try {
    await connectToDatabase();

    const residents = data.map((res) => ({
      firstname: res.firstname,
      middlename: res.middlename,
      lastname: res.lastname,
      suffix: res.suffix || "",
      gender: res.gender,
      purok: res.purok,
      isSeniorCitizen: String(res.isSeniorCitizen).toUpperCase() === "TRUE",
      isPwd: String(res.isPwd).toUpperCase() === "TRUE",
      birthdate: format(new Date(res.birthdate), "MMMM d,yyyy"),
    }));

    const inserted = await Resident.insertMany(residents);

    return {
      message: `${inserted.length} residents added successfully.`,
      data: inserted,
      isSuccess: true,
    };
  } catch (error) {
    console.error("Import failed:", error);
    return {
      message: "Failed to import residents.",
      isSuccess: false,
    };
  }
}
