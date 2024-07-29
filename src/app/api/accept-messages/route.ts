import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!(session && session.user)) {
    return Response.json(
      {
        success: false,
        Message: "Not authenticated!",
      },
      {
        status: 401,
      }
    );
  }

  const userId = user?._id;
  const { acceptMessages } = await req.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          Message: "failed to update status of user to accept messages.",
        },
        {
          status: 401,
        }
      );
    }
    return Response.json(
      {
        success: true,
        Message: "Message acceptance status updated successfully.",
        user,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("failed to update status of user to accept messages.");

    return Response.json(
      {
        success: false,
        Message: "failed to update status of user to accept messages.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!(session && session.user)) {
    return Response.json(
      {
        success: false,
        Message: "Not authenticated!",
      },
      {
        status: 401,
      }
    );
  }

  const userId = user?._id;

  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          Message: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: user?.isAcceptingMessages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("failed to find User.");

    return Response.json(
      {
        success: false,
        Message: "failed to get message acceptance status.",
      },
      {
        status: 500,
      }
    );
  }
}
