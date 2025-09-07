import { Router } from "express";
import { nanoid } from "nanoid";
import FileItem from "../models/FileItem.js";
import { presignPut, presignGet, deleteObject } from "../s3.js";

const r = Router();

// 업로드용 PUT 프리사인드 URL
r.post("/presign", async (req, res) => {
  const { filename, contentType } = req.body;
  if (!filename || !contentType) {
    return res.status(400).json({ error: "filename/contentType required" });
  }
  const key = `uploads/${Date.now()}-${nanoid(6)}-${filename}`;
  const url = await presignPut(key, contentType);
  res.json({ url, key });
});

// 메타데이터 저장
r.post("/", async (req, res) => {
  const { key, originalName, contentType, size, title = "", description = "" } = req.body;
  const doc = await FileItem.create({ key, originalName, contentType, size, title, description });
  res.status(201).json(doc);
});

// 목록
r.get("/", async (_req, res) => {
  const items = await FileItem.find().sort({ createdAt: -1 }).lean();
  const out = await Promise.all(
    items.map(async (it) => ({ ...it, url: await presignGet(it.key, 300) }))
  );
  res.json(out);
});

// 단건
r.get("/:id", async (req, res) => {
  const it = await FileItem.findById(req.params.id).lean();
  if (!it) return res.sendStatus(404);
  it.url = await presignGet(it.key, 300);
  res.json(it);
});

// 메타 수정
r.patch("/:id", async (req, res) => {
  const { title, description } = req.body;
  const it = await FileItem.findByIdAndUpdate(
    req.params.id,
    { title, description },
    { new: true }
  );
  res.json(it);
});

// 삭제 (DB + S3)
r.delete("/:id", async (req, res) => {
  const it = await FileItem.findById(req.params.id);
  if (!it) return res.sendStatus(404);
  await deleteObject(it.key);
  await it.deleteOne();
  res.sendStatus(204);
});

export default r;
