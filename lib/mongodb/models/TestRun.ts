import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestRun extends Document {
  title: string;
  description?: string;
  testCases: mongoose.Types.ObjectId[];
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";
  totalTests: number;
  passedTests: number;
  failedTests: number;
  blockedTests: number;
  executionTimeMs?: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const TestRunSchema = new Schema<ITestRun>(
  {
    title: { type: String, required: true },
    description: { type: String },
    testCases: [{ type: Schema.Types.ObjectId, ref: "TestCase" }],
    status: { type: String, enum: ["PENDING", "RUNNING", "COMPLETED", "FAILED", "CANCELLED"], default: "PENDING" },
    totalTests: { type: Number, default: 0 },
    passedTests: { type: Number, default: 0 },
    failedTests: { type: Number, default: 0 },
    blockedTests: { type: Number, default: 0 },
    executionTimeMs: { type: Number },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export const TestRun: Model<ITestRun> = mongoose.models.TestRun || mongoose.model<ITestRun>("TestRun", TestRunSchema);
