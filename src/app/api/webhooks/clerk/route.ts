import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import prisma from "@/lib/prisma";

interface ClerkUserCreatedEvent {
  type: "user.created";
  data: {
    id: string;
    email_addresses: Array<{ email_address: string; id: string }>;
    primary_email_address_id: string;
  };
}

interface ClerkUserDeletedEvent {
  type: "user.deleted";
  data: {
    id: string;
    deleted: boolean;
  };
}

type ClerkEvent = ClerkUserCreatedEvent | ClerkUserDeletedEvent;

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  // Get svix headers
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await req.text();

  // Verify webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let event: ClerkEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkEvent;
  } catch (err) {
    console.error("[Clerk Webhook] Verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle events
  if (event.type === "user.created") {
    const { id, email_addresses, primary_email_address_id } = event.data;

    const primaryEmail = email_addresses.find(
      (e) => e.id === primary_email_address_id
    )?.email_address;

    if (!primaryEmail) {
      return NextResponse.json({ error: "No primary email" }, { status: 400 });
    }

    try {
      await prisma.user.upsert({
        where: { clerkId: id },
        create: { clerkId: id, email: primaryEmail.toLowerCase() },
        update: { email: primaryEmail.toLowerCase() },
      });
      console.log(`[Clerk Webhook] User created: ${primaryEmail}`);
    } catch (err) {
      console.error("[Clerk Webhook] DB error on user.created:", err);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }
  }

  if (event.type === "user.deleted") {
    const { id } = event.data;
    try {
      await prisma.user.delete({ where: { clerkId: id } });
      console.log(`[Clerk Webhook] User deleted: ${id}`);
    } catch (err) {
      // User may not exist in DB yet — not an error
      console.warn("[Clerk Webhook] User delete (may not exist):", err);
    }
  }

  return NextResponse.json({ received: true });
}
