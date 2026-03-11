import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import { createElement } from "react";
import WaitlistConfirmEmail from "@/emails/WaitlistConfirmEmail";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, locale = "fr", source } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Check duplicate
    const existing = await prisma.waitlistEmail.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json({ error: "Already registered" }, { status: 409 });
    }

    // Create entry
    await prisma.waitlistEmail.create({
      data: {
        email: email.toLowerCase(),
        locale,
        source: source || null,
      },
    });

    // Send confirmation email
    try {
      await sendEmail({
        to: email,
        subject: "Bienvenue sur Pawmedic — Inscription confirmée",
        react: createElement(WaitlistConfirmEmail, { locale }),
      });
    } catch (emailErr) {
      console.error("[waitlist] Confirmation email failed:", emailErr);
      // Don't fail the registration if email fails
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/waitlist]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
