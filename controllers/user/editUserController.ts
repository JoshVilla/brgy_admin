import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/userModel";

export async function EditUserController(params: {
  id: string;
  name: string;
  username: string;
  phoneNumber: string;
}) {
  try {
    await connectToDatabase();
    const { id, name, username, phoneNumber } = params;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        username,
        phoneNumber,
      },
      { new: true } // return the updated document
    );

    return {
      message: "User updated successfully",
      isSuccess: true,
      data: updatedUser,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Failed to update user",
      isSuccess: false,
      error: error.message,
    };
  }
}
