import dbConnect from "@/lib/dbConnect";
import { userNameValidation } from "@/schema/signUpSchema";
import UserModel from "@/model/User";
import { z } from "zod";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, code } = await req.json();

    const decodedUsername = decodeURIComponent(username);

    const existingUser = await UserModel.findOne({
      username: decodedUsername,
    });

    if (!existingUser) {
      return Response.json(
        {
          success: false,
          message: "Username not found!",
        },
        { status: 400 }
      );
    }
    if (existingUser.isVerified) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken!",
        },
        { status: 400 }
      );
    }
    const isCodeValid = existingUser.verifyCode === code;
    const isCodeNotExpired =
      new Date(existingUser.verifyCodeExpiry) > new Date();

    if (!isCodeValid) {
      return Response.json(
        { 
          success: false,
          message:
            "Incorrect verify code.",
        },
        { status: 400 }
      );
    }
    if (!isCodeNotExpired) {
      return Response.json(
        { 
          success: false,
          message:
            "Code is expired. please signup again to get ta new code.",
        },
        { status: 400 }
      );
    }

    existingUser.isVerified = true;
    await existingUser.save();

    return Response.json(
      {
        success: true,
        message: "Account verified successfully.",
      },
      { status: 200 }
    );

    
  } catch (error) {
    console.error("Error veryfying user", error);
    return Response.json(
      {
        success: false,
        Message: "Error verifying user",
      },
      {
        status: 500,
      }
    );
  }
}
