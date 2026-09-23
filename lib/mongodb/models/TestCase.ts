import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestCase extends Document {
  title: string;
  description: string;
  module: string;
  preconditions: string;
  steps: string[];
  expectedResult: string;
  actualResult?: string;
  status: "DRAFT" | "READY" | "PASSED" | "FAILED" | "BLOCKED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const TestCaseSchema = new Schema<ITestCase>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    module: { type: String, required: true, index: true },
    preconditions: { type: String, default: "" },
    steps: { type: [String], required: true },
    expectedResult: { type: String, required: true },
    actualResult: { type: String },
    status: { type: String, enum: ["DRAFT", "READY", "PASSED", "FAILED", "BLOCKED"], default: "DRAFT", index: true },
    priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], default: "MEDIUM" },
    severity: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], default: "MEDIUM" },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export const TestCase: Model<ITestCase> = mongoose.models.TestCase || mongoose.model<ITestCase>("TestCase", TestCaseSchema);
