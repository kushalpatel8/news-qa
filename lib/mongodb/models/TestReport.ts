import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestReport extends Document {
  title: string;
  testRunId: mongoose.Types.ObjectId;
  summary: string;
  passedCount: number;
  failedCount: number;
  blockedCount: number;
  executionDurationMs: number;
  reportUrl?: string; // e.g. for HTML or PDF exports
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const TestReportSchema = new Schema<ITestReport>(
  {
    title: { type: String, required: true },
    testRunId: { type: Schema.Types.ObjectId, ref: "TestRun", required: true },
    summary: { type: String, required: true },
    passedCount: { type: Number, required: true },
    failedCount: { type: Number, required: true },
    blockedCount: { type: Number, required: true },
    executionDurationMs: { type: Number, required: true },
    reportUrl: { type: String },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export const TestReport: Model<ITestReport> = mongoose.models.TestReport || mongoose.model<ITestReport>("TestReport", TestReportSchema);
