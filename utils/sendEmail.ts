import { env } from "@/env";
import { Resend } from "resend";

interface EmailData {
  from: string;
  toAdmin: string;
  toClient: string;
  subjectAdmin: string;
  subjectClient: string;
  bodyAdmin: string;
  bodyClient: string;
}

const resend = new Resend(env.RESEND_API_KEY);

export default async function sendEmail({
  from,
  toAdmin,
  toClient,
  subjectAdmin,
  subjectClient,
  bodyAdmin,
  bodyClient,
}: EmailData) {
  try {
    const sendEmail = await resend.emails.send({
      from,
      to: toAdmin,
      subject: subjectAdmin,
      html: bodyAdmin,
    });
    if (!sendEmail.data) {
      console.error("Error sending email:", sendEmail.error);
    }

    await resend.emails.send({
      from,
      to: toClient,
      subject: subjectClient,
      html: bodyClient,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
