import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiRespons } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiRespons> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "True Feedback | Verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return {
      success: true,
      message: "verification code sent successfully.",
    };
  } catch (emailError) {
    console.error("Error sending verification Email", emailError);
    return { success: false, message: "failed to send verification email!" };
  }
}
