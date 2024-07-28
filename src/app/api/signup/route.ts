import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendEmail";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await req.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const existingUserByEmail = await UserModel.findOne({
      email,
    });

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "This email already exists.",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    }

    // create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      verifyCode,
      verifyCodeExpiry: expiryDate,
      isVerified: false,
      isAcceptingMessages: true,
      messages: [],
    });

    await newUser.save();
    // send verification email

    const responseEmail = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!responseEmail.success) {
      return Response.json(
        {
          success: false,
          message: responseEmail.message,
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User registered successfully, please verify your email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("error registering user", error);
    return Response.json(
      {
        success: false,
        message: "error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
