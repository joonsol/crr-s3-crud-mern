import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3 = new S3Client({ region: process.env.AWS_REGION });

export const presignPut = (Key, ContentType) =>
  getSignedUrl(
    s3,
    new PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key, ContentType }),
    { expiresIn: 60 }
  );

export const presignGet = (Key, sec = 300) =>
  getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key }),
    { expiresIn: sec }
  );

export const deleteObject = (Key) =>
  s3.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET, Key }));
