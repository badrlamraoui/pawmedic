import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const animal = await prisma.animal.findUnique({ where: { id } });

    if (!animal || animal.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ animal });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.animal.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.animal.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        species: body.species ?? existing.species,
        breed: body.breed !== undefined ? body.breed : existing.breed,
        birthDate: body.birthDate !== undefined ? (body.birthDate ? new Date(body.birthDate) : null) : existing.birthDate,
        sex: body.sex !== undefined ? body.sex : existing.sex,
        sterilized: body.sterilized !== undefined ? body.sterilized : existing.sterilized,
        weightKg: body.weightKg !== undefined ? body.weightKg : existing.weightKg,
        color: body.color !== undefined ? body.color : existing.color,
        microchipId: body.microchipId !== undefined ? body.microchipId : existing.microchipId,
        vetName: body.vetName !== undefined ? body.vetName : existing.vetName,
        photoUrl: body.photoUrl !== undefined ? body.photoUrl : existing.photoUrl,
      },
    });

    return NextResponse.json({ animal: updated });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const existing = await prisma.animal.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.animal.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
