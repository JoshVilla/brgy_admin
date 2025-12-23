import { connectToDatabase } from "@/lib/mongodb";
import Admin, { IAdmin } from "@/models/adminModel";
import { hashPassword } from "@/utils/asyncHelpers";

export async function AddAdminController(params: IAdmin) {
  try {
    await connectToDatabase();

    const { username, password, isSuperAdmin } = params;

    //check if username already used
    const isUsernameExist = await Admin.findOne({ username });

    if (isUsernameExist) {
      return {
        message: "Username already exist",
        isSuccess: true,
      };
    }

    //hash password
    const hashedPassword = await hashPassword(password);

    const newAdmin = await Admin.create({
      username,
      password: hashedPassword,
      isSuperAdmin,
    });

    return {
      message: "Admin Added Successfully!",
      data: newAdmin,
      isSuccess: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      message: "Failed to add resident.",
      isSuccess: false,
      error: error.message || "An unknown error occurred.", // Provide a helpful error message
    };
  }
}
