import mongoose from "mongoose";

const FileItemSchema = new mongoose.Schema({
  key: { type: String, required: true, index: true },
  originalName: String,
  contentType: String,
  size: Number,
  title: String,        // 메타데이터 예시
  description: String,  // 메타데이터 예시
}, { timestamps: true });

export default mongoose.model("FileItem", FileItemSchema);
