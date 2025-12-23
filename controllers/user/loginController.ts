import { connectToDatabase } from "@/lib/mongodb";
import User, { IUser } from "@/models/userModel";
import { comparePassword } from "@/utils/asyncHelpers";

interface ILogin {
  username: string;
  password: string;
}

export async function LoginController(params: ILogin) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ username: params.username });

    if (!user)
      return {
        message: "Username doesnt exist",
        isSuccess: false,
      };

    const isPasswordMatch = await comparePassword(
      params.password,
      user.password
    );

    if (isPasswordMatch) {
      return {
        message: "Login Successfully",
        isSuccess: true,
        data: user,
      };
    }

    return {
      message: "Password doesnt match",
      isSuccess: false,
    };
  } catch (error) {
    console.log(error);
  }
}
