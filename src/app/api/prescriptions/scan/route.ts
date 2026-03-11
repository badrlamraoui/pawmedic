import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { anthropic, PRESCRIPTION_SYSTEM_PROMPT } from "@/lib/anthropic";
import { uploadPrescriptionImage } from "@/lib/r2";
import type { PrescriptionResult } from "@/types";

function parseResult(text: string): PrescriptionResult {
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned);
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();

    // Only PREMIUM and FAMILLE can scan prescriptions
    if (user.plan === "FREE") {
      return NextResponse.json({ error: "Premium feature" }, { status: 403 });
    }

    const body = await req.json();
    const { animalId, imageBase64, mimeType } = body;

    if (!animalId || !imageBase64 || !mimeType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Ownership check
    const animal = await prisma.animal.findUnique({ where: { id: animalId } });
    if (!animal || animal.userId !== user.id) {
      return NextResponse.json({ error: "Animal not found" }, { status: 404 });
    }

    // Call Claude with vision
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: PRESCRIPTION_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
                data: imageBase64,
              },
            },
            {
              type: "text",
              text: `Animal: ${animal.name} (${animal.species}). Please analyze this veterinary prescription.`,
            },
          ],
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    let resultJson: PrescriptionResult;

    try {
      resultJson = parseResult(text);
    } catch {
      return NextResponse.json({ error: "Failed to parse prescription" }, { status: 500 });
    }

    // Upload image to R2
    const buffer = Buffer.from(imageBase64, "base64");
    const { url: imageUrl } = await uploadPrescriptionImage(buffer, mimeType, animalId);

    // Save prescription to DB
    const prescription = await prisma.prescription.create({
      data: {
        animalId,
        imageUrl,
        extractedJson: resultJson as any,
      },
    });

    // Create health events for each medication
    for (const med of resultJson.medications) {
      await prisma.healthEvent.create({
        data: {
          animalId,
          type: "TREATMENT",
          name: med.name,
          date: new Date(),
          notes: `${med.dosage} — ${med.frequency} — ${med.purpose}`,
          prescriptionUrl: imageUrl,
        },
      });
    }

    return NextResponse.json({ result: resultJson, prescriptionId: prescription.id });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[POST /api/prescriptions/scan]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
