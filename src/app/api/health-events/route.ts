import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();
    const animalId = req.nextUrl.searchParams.get("animalId");

    const where = animalId
      ? { animalId, animal: { userId: user.id } }
      : { animal: { userId: user.id } };

    const events = await prisma.healthEvent.findMany({
      where,
      orderBy: { date: "desc" },
      include: {
        animal: { select: { id: true, name: true, species: true } },
      },
    });

    return NextResponse.json({ events });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();

    const { animalId, type, name, date, nextDue, vetName, notes } = body;

    if (!animalId || !type || !name || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Ownership check
    const animal = await prisma.animal.findUnique({ where: { id: animalId } });
    if (!animal || animal.userId !== user.id) {
      return NextResponse.json({ error: "Animal not found" }, { status: 404 });
    }

    const event = await prisma.healthEvent.create({
      data: {
        animalId,
        type,
        name,
        date: new Date(date),
        nextDue: nextDue ? new Date(nextDue) : null,
        vetName: vetName || null,
        notes: notes || null,
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[POST /api/health-events]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
