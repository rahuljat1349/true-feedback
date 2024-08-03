import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(
  req: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
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

  try {
    const result = await UserModel.updateOne(
      {
        _id: user?._id,
      },
      { $pull: { messages: { _id: messageId } } }
    );

    if (result.modifiedCount == 0) {
      return Response.json(
        {
          success: false,
          Message: "Message not found or already deleted!",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        success: true,
        Message: "deleted!",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Errror in delete message route ", error);

    return Response.json(
      {
        success: false,
        Message: "Error deleting message!",
      },
      {
        status: 500,
      }
    );
  }
}
