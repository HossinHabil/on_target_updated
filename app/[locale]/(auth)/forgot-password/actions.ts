"use server";

import { env } from "@/env";
import {
  forgotPasswordSchema,
  ForgotPasswordSchemaType,
} from "@/lib/schema/RegistrationFormSchema";
import { resetPassword } from "@/templates/resetPassword";
import { getUserByEmail } from "@/utils/user";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

export default async function forgotPassword(values: ForgotPasswordSchemaType) {
  try {
    const validatedFields = forgotPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid Fields!" };
    }

    const { email } = validatedFields.data;

    const user = await getUserByEmail(email);

    if (!user || !user.name) {
      return { error: "User not found!" };
    }

    const url = `${env.NEXT_PUBLIC_BASE_URL}/reset-password/${user.id}`;
    const sendEmail = await resend.emails.send({
      from: "mail@ontarget.exchange",
      to: email,
      subject: "Reset Password",
      html: resetPassword({ email_link: url, user_name: user.name }),
    });

    if (sendEmail.error) {
      return {
        error: "Something went wrong!",
      };
    }

    return { success: "Email sent successfully!" };
  } catch (error) {
    return {
      error: "Something went wrong!",
    };
  }
}
