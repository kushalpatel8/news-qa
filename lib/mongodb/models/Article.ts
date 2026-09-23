import mongoose, { Schema, Document, Model } from "mongoose";

export interface IArticle extends Document {
  title: string;
  slug: string;
  content: string;
  author?: string;
  category: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt?: Date;
  tags: string[];
  image?: string;
  validationResults?: any; // To store AI or custom validation outputs
  createdBy: string; // Clerk user ID
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: String, required: true },
    author: { type: String },
    category: { type: String, required: true },
    status: { type: String, enum: ["DRAFT", "PUBLISHED", "ARCHIVED"], default: "DRAFT", index: true },
    publishedAt: { type: Date },
    tags: { type: [String], default: [] },
    image: { type: String },
    validationResults: { type: Schema.Types.Mixed },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export const Article: Model<IArticle> = mongoose.models.Article || mongoose.model<IArticle>("Article", ArticleSchema);
