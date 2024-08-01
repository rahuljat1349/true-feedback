import dbConnect from "@/lib/dbConnect";
import { userNameValidation } from "@/schema/signUpSchema";
import UserModel from "@/model/User";
import { z } from "zod";

const usernameQuerySchema = z.object({
  username: userNameValidation,
});

export async function GET(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    const result = usernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message: usernameErrors,
          usernameErrors,
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      
      return Response.json(
        {
          success: false,
          message: "Username is already taken!",
        },
        { status: 400 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Username is available ✔️",
      },
      { status: 200 }
    );


  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      {
        success: false,
        Message: "Error checking username",
      },
      {
        status: 500,
      }
    );
  }
}
