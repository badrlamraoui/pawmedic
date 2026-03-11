import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import prisma from "@/lib/prisma";
import type { Plan } from "@prisma/client";

const VARIANT_TO_PLAN: Record<string, Plan> = {
  [process.env.LEMONSQUEEZY_PREMIUM_VARIANT_ID || ""]: "PREMIUM",
  [process.env.LEMONSQUEEZY_FAMILLE_VARIANT_ID || ""]: "FAMILLE",
};

function verifyHmac(payload: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
  const hmac = createHmac("sha256", secret).update(payload).digest("hex");
  return hmac === signature;
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature");
  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const body = await req.text();

  if (!verifyHmac(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName: string = event.meta?.event_name;
  const data = event.data?.attributes;
  const customData = event.meta?.custom_data;
  const userId = customData?.user_id;

  if (!userId) {
    console.warn("[LemonSqueezy] No user_id in custom_data");
    return NextResponse.json({ received: true });
  }

  try {
    if (eventName === "subscription_created" || eventName === "subscription_updated") {
      const variantId = String(data?.variant_id);
      const plan = VARIANT_TO_PLAN[variantId] || "FREE";
      const status = data?.status;

      if (status === "active" || status === "on_trial") {
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan,
            lsSubscriptionId: String(data?.id || ""),
            lsVariantId: variantId,
            lsCustomerId: String(data?.customer_id || ""),
            lsCurrentPeriodEnd: data?.renews_at ? new Date(data.renews_at) : null,
          },
        });
        console.log(`[LemonSqueezy] User ${userId} upgraded to ${plan}`);
      }
    }

    if (eventName === "subscription_cancelled" || eventName === "subscription_expired") {
      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: "FREE",
          lsSubscriptionId: null,
          lsVariantId: null,
          lsCurrentPeriodEnd: null,
        },
      });
      console.log(`[LemonSqueezy] User ${userId} downgraded to FREE`);
    }
  } catch (err) {
    console.error("[LemonSqueezy] DB update failed:", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
