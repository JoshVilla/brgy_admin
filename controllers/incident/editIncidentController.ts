import { connectToDatabase } from "@/lib/mongodb";
import IncidentReport from "@/models/incidentModel";

interface EditIncidentParams {
  _id: string;
  status: string;
}

export async function EditIncidentReportController(params: EditIncidentParams) {
  try {
    await connectToDatabase();

    const updatedStatus = await IncidentReport.findByIdAndUpdate(
      params._id,
      { status: params.status },
      { new: true }, // Returns the updated document
    );

    if (!updatedStatus) {
      return {
        isSuccess: false,
        message: "Incident report not found",
      };
    }

    return {
      isSuccess: true,
      data: updatedStatus,
      message: "Status Updated Successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      isSuccess: false,
      message: "Failed to update status",
    };
  }
}
