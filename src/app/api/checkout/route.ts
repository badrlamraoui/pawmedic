import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { createCheckoutUrl } from "@/lib/lemonsqueezy";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const { plan, locale = "fr" } = body;

    if (!plan || !["PREMIUM", "FAMILLE"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const url = await createCheckoutUrl({
      plan,
      userEmail: user.email,
      userId: user.id,
      locale,
    });

    return NextResponse.json({ url });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[POST /api/checkout]", error);
    return NextResponse.json({ error: "Checkout creation failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();
    const plan = req.nextUrl.searchParams.get("plan") as "PREMIUM" | "FAMILLE";
    const locale = req.nextUrl.searchParams.get("locale") || "fr";

    if (!plan || !["PREMIUM", "FAMILLE"].includes(plan)) {
      return NextResponse.redirect(new URL(`/${locale}/profile`, req.url));
    }

    const url = await createCheckoutUrl({
      plan,
      userEmail: user.email,
      userId: user.id,
      locale,
    });

    return NextResponse.redirect(url);
  } catch (error) {
    console.error("[GET /api/checkout]", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
