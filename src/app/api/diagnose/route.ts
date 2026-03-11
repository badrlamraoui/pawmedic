import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { anthropic, DIAGNOSIS_SYSTEM_PROMPT } from "@/lib/anthropic";
import { uploadDiagnosisPhoto } from "@/lib/r2";
import type { DiagnosisResult } from "@/types";

const FREE_MONTHLY_LIMIT = 3;

function parseResult(text: string): DiagnosisResult {
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned);
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();

    // Check FREE plan limit
    if (user.plan === "FREE") {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const monthlyCount = await prisma.diagnosis.count({
        where: {
          animal: { userId: user.id },
          createdAt: { gte: startOfMonth },
          archived: false,
        },
      });

      if (monthlyCount >= FREE_MONTHLY_LIMIT) {
        return NextResponse.json({ error: "Monthly limit reached" }, { status: 429 });
      }
    }

    const formData = await req.formData();
    const animalId = formData.get("animalId") as string;
    const symptomsText = formData.get("symptomsText") as string;
    const bodyArea = formData.get("bodyArea") as string | null;
    const duration = formData.get("duration") as string | null;
    const intensity = formData.get("intensity") as string | null;
    const evolution = formData.get("evolution") as string | null;
    const photos = formData.getAll("photos") as File[];

    if (!animalId || !symptomsText) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Ownership check
    const animal = await prisma.animal.findUnique({ where: { id: animalId } });
    if (!animal || animal.userId !== user.id) {
      return NextResponse.json({ error: "Animal not found" }, { status: 404 });
    }

    // Upload photos if any
    const photoUrls: string[] = [];
    for (const photo of photos.slice(0, 3)) {
      try {
        const buffer = Buffer.from(await photo.arrayBuffer());
        const { url } = await uploadDiagnosisPhoto(buffer, photo.type, animalId);
        photoUrls.push(url);
      } catch (err) {
        console.error("[diagnose] Photo upload failed:", err);
      }
    }

    // Build user message
    const userMessage = [
      `Animal: ${animal.name} (${animal.species}${animal.breed ? `, ${animal.breed}` : ""})`,
      `Zone affectée: ${bodyArea || "Non précisée"}`,
      `Symptômes: ${symptomsText}`,
      duration && `Depuis: ${duration}`,
      intensity && `Intensité: ${intensity}`,
      evolution && `Évolution: ${evolution}`,
    ]
      .filter(Boolean)
      .join("\n");

    // Build Anthropic message content
    const messageContent: any[] = [{ type: "text", text: userMessage }];

    // Add images if available
    for (const url of photoUrls) {
      messageContent.push({
        type: "text",
        text: `Image: ${url}`,
      });
    }

    // Call Claude
    let resultJson: DiagnosisResult | null = null;
    let attempts = 0;

    while (attempts < 2 && !resultJson) {
      try {
        const response = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: DIAGNOSIS_SYSTEM_PROMPT,
          messages: [{ role: "user", content: messageContent }],
        });

        const text = response.content[0].type === "text" ? response.content[0].text : "";
        resultJson = parseResult(text);
      } catch (parseErr) {
        attempts++;
        if (attempts >= 2) throw parseErr;
      }
    }

    if (!resultJson) {
      return NextResponse.json({ error: "AI analysis failed" }, { status: 500 });
    }

    // Save diagnosis
    const diagnosis = await prisma.diagnosis.create({
      data: {
        animalId,
        symptomsText,
        bodyArea: bodyArea || null,
        duration: duration || null,
        photoUrls,
        resultJson: resultJson as any,
        urgencyLevel: resultJson.urgency_level,
      },
    });

    return NextResponse.json({ result: resultJson, diagnosisId: diagnosis.id });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[POST /api/diagnose]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
