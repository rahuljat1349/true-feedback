import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(req: Request) {
  await dbConnect();

  const { username, content } = await req.json();

  try {
    const user = await UserModel.findOne({ username });

    if (!username) {
      return Response.json(
        {
          success: false,
          message: "User not found!",
        },
        {
          status: 404,
        }
      );
    }

    if (!user?.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages!",
        },
        {
          status: 403,
        }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("failed to send Message.");

    return Response.json(
      {
        success: false,
        message: "failed to send Message.",
      },
      {
        status: 500,
      }
    );
  }
}
