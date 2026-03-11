import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL!;

export interface UploadResult {
  url: string;
  key: string;
}

export async function uploadToR2(
  buffer: Buffer,
  mimeType: string,
  folder: string,
  filename?: string
): Promise<UploadResult> {
  const ext = mimeType.split("/")[1] || "bin";
  const key = `${folder}/${filename || randomUUID()}.${ext}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return {
    url: `${PUBLIC_URL}/${key}`,
    key,
  };
}

export async function uploadDiagnosisPhoto(
  buffer: Buffer,
  mimeType: string,
  animalId: string
): Promise<UploadResult> {
  return uploadToR2(buffer, mimeType, `diagnoses/${animalId}`);
}

export async function uploadPrescriptionImage(
  buffer: Buffer,
  mimeType: string,
  animalId: string
): Promise<UploadResult> {
  return uploadToR2(buffer, mimeType, `prescriptions/${animalId}`);
}

export async function uploadAnimalPhoto(
  buffer: Buffer,
  mimeType: string,
  animalId: string
): Promise<UploadResult> {
  return uploadToR2(buffer, mimeType, `animals/${animalId}`, "avatar");
}

export async function deleteFromR2(key: string): Promise<void> {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
  );
}
