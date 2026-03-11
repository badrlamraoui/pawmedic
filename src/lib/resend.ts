import { Resend } from "resend";
import { ReactElement } from "react";

// Lazy init — évite l'erreur au build si RESEND_API_KEY n'est pas défini
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY ?? "placeholder");
  return _resend;
}

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: ReactElement;
  from?: string;
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  react,
  from = `Pawmedic <no-reply@${process.env.EMAIL_FROM_DOMAIN || "pawmedic.app"}>`,
  replyTo,
}: SendEmailOptions) {
  try {
    const result = await getResend().emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      react,
      ...(replyTo ? { replyTo } : {}),
    });

    if (result.error) {
      console.error("[Resend] Error sending email:", result.error);
      throw new Error(result.error.message);
    }

    return result.data;
  } catch (error) {
    console.error("[Resend] Failed to send email:", error);
    throw error;
  }
}
