import { connectToDatabase } from "@/lib/mongodb";
import User, { IUser } from "@/models/userModel";
import { hashPassword } from "@/utils/asyncHelpers";

export async function RegisterController(params: IUser) {
  try {
    await connectToDatabase();

    //check if username exist
    const usernameExist = await User.findOne({ username: params.username });

    if (usernameExist)
      return {
        message: "Username already exist",
        isSuccess: false,
      };

    const hashedPassword = await hashPassword(params.password);

    const newData = await User.create({
      ...params,
      password: hashedPassword,
    });

    return {
      message: "Account Created Succesffuly",
      isSuccess: true,
      data: newData,
    };
  } catch (error) {
    console.log(error);
  }
}
