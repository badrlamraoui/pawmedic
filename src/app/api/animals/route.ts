import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const user = await requireUser();
    const animals = await prisma.animal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        species: true,
        breed: true,
        birthDate: true,
        sex: true,
        sterilized: true,
        weightKg: true,
        color: true,
        photoUrl: true,
        vetName: true,
        microchipId: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ animals });
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

    const {
      name,
      species,
      breed,
      birthDate,
      sex,
      sterilized,
      weightKg,
      color,
      microchipId,
      vetName,
    } = body;

    if (!name || !species) {
      return NextResponse.json({ error: "Name and species are required" }, { status: 400 });
    }

    const animal = await prisma.animal.create({
      data: {
        userId: user.id,
        name,
        species,
        breed: breed || null,
        birthDate: birthDate ? new Date(birthDate) : null,
        sex: sex || null,
        sterilized: sterilized || false,
        weightKg: weightKg || null,
        color: color || null,
        microchipId: microchipId || null,
        vetName: vetName || null,
      },
    });

    return NextResponse.json({ animal }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[POST /api/animals]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
