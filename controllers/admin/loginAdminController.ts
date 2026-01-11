import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/adminModel";
import Settings from "@/models/settingsModel";
import { comparePassword } from "@/utils/asyncHelpers";
import jwt from "jsonwebtoken";

export async function LoginAdminController(params: {
  username: string;
  password: string;
}) {
  try {
    const { username, password } = params;
    const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET as string;
    await connectToDatabase();

    const user = await Admin.findOne({ username });
    const settings = await Settings.findById("SYSTEM_SETTINGS").select(
      "general"
    );

    if (!user) {
      return {
        message: "Username doesnt exist",
        isSuccess: false,
      };
    }

    const isPasswordMatched = await comparePassword(password, user.password);

    //set jwt token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        isSuperAdmin: user.isSuperAdmin,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    if (isPasswordMatched) {
      delete user.password; // Never expose password
      return {
        message: "Login Successfully!",
        isSuccess: true,
        data: user,
        settings: settings.general,
        token,
      };
    } else {
      return {
        message: "Password doesn't matched",
        isSuccess: false,
      };
    }
  } catch (error) {
    console.log(error);
  }
}
