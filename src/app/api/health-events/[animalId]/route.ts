import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface Params {
  params: Promise<{ animalId: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { animalId } = await params;

    // Ownership check
    const animal = await prisma.animal.findUnique({ where: { id: animalId } });
    if (!animal || animal.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const events = await prisma.healthEvent.findMany({
      where: { animalId },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ events });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
