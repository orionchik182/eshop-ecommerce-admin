import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export async function uploadFile(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const Key   = `${randomUUID()}-${file.name}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key,
      Body: bytes,
      ContentType: file.type,
      ACL: 'public-read',              // либо используйте bucket-policy
    })
  );

  return `${process.env.S3_PUBLIC_URL}/${Key}`; // готовый URL
}

export async function deleteFile(key: string) {
  // key = "uuid-filename.jpg"
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
    })
  );
}