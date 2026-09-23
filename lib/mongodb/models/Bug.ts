import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBug extends Document {
  title: string;
  description: string;
  stepsToReproduce: string;
  expectedResult: string;
  actualResult: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "ASSIGNED" | "IN_PROGRESS" | "FIXED" | "RETEST" | "VERIFIED";
  environment: string;
  screenshotUrl?: string;
  assignedTo?: string; // Clerk user ID
  reporterRole?: string; // e.g. "Admin", "Editor", "QA", "Developer"
  createdBy: string; // Clerk user ID
  createdAt: Date;
  updatedAt: Date;
}

const BugSchema = new Schema<IBug>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    stepsToReproduce: { type: String, required: true },
    expectedResult: { type: String, required: true },
    actualResult: { type: String, required: true },
    severity: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], required: true, index: true },
    priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], required: true },
    status: { type: String, enum: ["OPEN", "ASSIGNED", "IN_PROGRESS", "FIXED", "RETEST", "VERIFIED"], default: "OPEN", index: true },
    environment: { type: String, required: true },
    screenshotUrl: { type: String },
    assignedTo: { type: String },
    reporterRole: { type: String, enum: ["ADMIN", "EDITOR", "QA", "VIEWER"], default: "QA" },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export const Bug: Model<IBug> = mongoose.models.Bug || mongoose.model<IBug>("Bug", BugSchema);
