import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  _Object,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const REGION = process.env.S3_REGION!;
const BUCKET = process.env.S3_BUCKET!;
const PUBLIC_URL = process.env.S3_PUBLIC_URL!;

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export async function uploadFile(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const Key = `${randomUUID()}-${file.name}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key,
      Body: bytes,
      ContentType: file.type,
      ACL: "public-read", // либо используйте bucket-policy
    }),
  );

  return `${PUBLIC_URL}/${Key}`; // готовый URL
}

export async function deleteFile(key: string) {
  // key = "uuid-filename.jpg"
  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    }),
  );
}

export async function getFiles(prefix = ""): Promise<string[]> {
  /* prefix ─ под-папка внутри bucket'а (по умолчанию все объекты) */
  const res = await s3.send(
    new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix, // "" = весь bucket
    }),
  );

  const objects = res.Contents as _Object[] | undefined;
  if (!objects?.length) return [];

  return objects.map((o) => `${PUBLIC_URL}/${o.Key}`);
}

export async function updateFile(
  oldKey: string,
  newFile: File,
): Promise<string> {
  /* 1. Загружаем новый объект */
  const newBytes = new Uint8Array(await newFile.arrayBuffer());
  const newKey = `${randomUUID()}-${newFile.name}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: newKey,
      Body: newBytes,
      ContentType: newFile.type,
      ACL: "public-read",
    }),
  );

  /* 2. Удаляем старый (или, если требуется версионность, пропускаем) */
  await deleteFile(oldKey);

  /* 3. Возвращаем новый публичный URL */
  return `${PUBLIC_URL}/${newKey}`;
}
