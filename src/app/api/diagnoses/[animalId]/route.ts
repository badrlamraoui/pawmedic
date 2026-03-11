import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface Params {
  params: Promise<{ animalId: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { animalId } = await params;

    // Ownership check
    const animal = await prisma.animal.findUnique({ where: { id: animalId } });
    if (!animal || animal.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const limit = req.nextUrl.searchParams.get("limit");
    const take = limit ? parseInt(limit) : 20;

    const diagnoses = await prisma.diagnosis.findMany({
      where: { animalId, archived: false },
      orderBy: { createdAt: "desc" },
      take,
      select: {
        id: true,
        symptomsText: true,
        bodyArea: true,
        duration: true,
        photoUrls: true,
        resultJson: true,
        urgencyLevel: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ diagnoses });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
