import { connectToDatabase } from "@/lib/mongodb";
import MonthlySummary from "@/models/monthlySummaryRequestModel";

interface GetMonthlySummaryParams {
  year: number;
  month: number; // 1-12
}

export async function GetMonthlySummaryController({
  year,
  month,
}: GetMonthlySummaryParams) {
  try {
    await connectToDatabase();

    // Validate inputs
    if (!year || !month) {
      return {
        message: "Year and month are required.",
        data: null,
        isSuccess: false,
        error: "Missing parameters",
      };
    }

    if (month < 1 || month > 12) {
      return {
        message: "Month must be between 1 and 12.",
        data: null,
        isSuccess: false,
        error: "Invalid month",
      };
    }

    if (year < 2000 || year > 2100) {
      return {
        message: "Year must be between 2000 and 2100.",
        data: null,
        isSuccess: false,
        error: "Invalid year",
      };
    }

    // Find the monthly summary
    const monthlySummary = await MonthlySummary.findOne({
      year,
      month,
    });

    if (!monthlySummary) {
      return {
        message: `No summary found for ${new Date(
          year,
          month - 1
        ).toLocaleString("default", { month: "long" })} ${year}.`,
        data: null,
        isSuccess: false,
        error: "Summary not found",
      };
    }

    return {
      message: "Monthly summary retrieved successfully.",
      data: monthlySummary,
      isSuccess: true,
      error: null,
    };
  } catch (error: any) {
    console.error("Error retrieving monthly summary:", error);
    return {
      message: "An error occurred while retrieving the monthly summary.",
      data: null,
      isSuccess: false,
      error: error.message || "Unknown error",
    };
  }
}
