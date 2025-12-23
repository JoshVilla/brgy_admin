import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/adminModel";
import { comparePassword, hashPassword } from "@/utils/asyncHelpers";

interface IParams {
  id: string;
  username: string;
  newPassword?: string;
  currentPassword?: string;
}

export async function EditProfileController(params: IParams) {
  try {
    await connectToDatabase();

    const { id, username, newPassword, currentPassword } = params;

    const admin = await Admin.findById(id);

    if (!admin) {
      return {
        isSuccess: false,
        message: "Admin not found",
      };
    }

    if (currentPassword) {
      const isMatch = await comparePassword(currentPassword, admin.password);
      if (!isMatch) {
        return {
          isSuccess: false,
          message: "Current password is incorrect",
        };
      }

      if (newPassword) {
        const hashedPassword = await hashPassword(newPassword);

        const updatedAdmin = await Admin.findByIdAndUpdate(
          id,
          {
            username,
            password: hashedPassword,
          },
          { new: true } // return the updated document
        );

        const cleanAdmin = updatedAdmin?.toObject();
        delete cleanAdmin?.password; // Never expose password

        return {
          message: "Profile updated successfully",
          isSuccess: true,
          data: cleanAdmin,
        };
      }
    }

    // If no password change, just update username
    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { username },
      { new: true }
    );

    const cleanAdmin = updatedAdmin?.toObject();
    delete cleanAdmin?.password;

    return {
      message: "Profile updated successfully",
      isSuccess: true,
      data: cleanAdmin,
    };
  } catch (error) {
    console.error("EditProfileController error:", error);
    return {
      isSuccess: false,
      message: "Internal server error",
    };
  }
}
