import { connectToDatabase } from "@/lib/mongodb";
import Resident from "@/models/residentModel";
import { IResResident } from "@/utils/types";

export async function EditResidentController(params: IResResident) {
  try {
    await connectToDatabase();

    const {
      _id,
      firstname,
      middlename,
      lastname,
      birthdate,
      suffix,
      gender,
      purok,
      isSeniorCitizen,
      isPwd,
    } = params;

    const updatedResident = await Resident.findByIdAndUpdate(
      _id,
      {
        firstname,
        middlename,
        lastname,
        birthdate,
        suffix,
        gender,
        purok,
        isSeniorCitizen,
        isPwd,
      },
      { new: true } // return the updated document
    );

    if (!updatedResident) {
      return {
        message: "Resident not found.",
        data: null,
        isSuccess: false,
      };
    }

    return {
      message: "Resident updated successfully.",
      data: updatedResident,
      isSuccess: true,
    };
  } catch (error: any) {
    console.error("Error updating resident:", error);
    return {
      message: "An error occurred while updating the resident.",
      data: null,
      isSuccess: false,
      error: error.message || "Unknown error",
    };
  }
}
