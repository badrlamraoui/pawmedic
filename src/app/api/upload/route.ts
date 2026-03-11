import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import {
  uploadAnimalPhoto,
  uploadDiagnosisPhoto,
  uploadPrescriptionImage,
} from "@/lib/r2";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null;
    const animalId = formData.get("animalId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Max 5MB." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const id = animalId || user.id;

    let result;
    switch (type) {
      case "animal":
        result = await uploadAnimalPhoto(buffer, file.type, id);
        break;
      case "diagnosis":
        result = await uploadDiagnosisPhoto(buffer, file.type, id);
        break;
      case "prescription":
        result = await uploadPrescriptionImage(buffer, file.type, id);
        break;
      default:
        return NextResponse.json({ error: "Invalid upload type" }, { status: 400 });
    }

    return NextResponse.json({ url: result.url, key: result.key });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[POST /api/upload]", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
