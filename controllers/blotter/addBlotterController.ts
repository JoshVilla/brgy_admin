// controllers/blotter/addBlotterController.ts
import { connectToDatabase } from "@/lib/mongodb";
import Blotter from "@/models/blotterModel";
export async function AddBlotter(body: any) {
  try {
    await connectToDatabase();

    // Generate blotter number
    const year = new Date().getFullYear();
    const count = await Blotter.countDocuments();
    const blotterNo = `BLT-${year}-${String(count + 1).padStart(5, "0")}`;

    // Create blotter entry
    const blotter = await Blotter.create({
      ...body,
      blotterNo,
    });

    return {
      isSuccess: true,
      data: blotter,
      message: "Blotter entry created successfully",
    };
  } catch (error: any) {
    console.error("Error creating blotter:", error);

    return {
      isSuccess: false,
      error: "Failed to create blotter entry",
    };
  }
}
