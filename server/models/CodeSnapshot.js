/**
 * server/models/CodeSnapshot.js
 * Mongoose model for versioned code snapshots.
 *
 * Fields required by the project spec:
 * - filename (string), path (string), content (string), language (string),
 * - version (int), commitMessage (string), analysis (object),
 * - createdAt (date), tags (array of strings), userId (optional).
 */

import mongoose from "mongoose";

const AnalysisSchema = new mongoose.Schema(
  {
    explanation: { type: String, default: "" },
    issues: {
      type: [{ line: Number, message: String, severity: String }],
      default: [],
    },
    suggestions: { type: [String], default: [] },
    conceptTags: { type: [String], default: [] },
    testCases: { type: [String], default: [] },
  },
  { _id: false }
);

const CodeSnapshotSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    path: { type: String, required: true },
    content: { type: String, default: "" },
    language: { type: String, required: true },
    version: { type: Number, default: 1 },
    commitMessage: { type: String, default: "" },
    analysis: { type: AnalysisSchema, default: () => ({}) },
    createdAt: { type: Date, default: () => new Date() },
    tags: { type: [String], default: [] },
    userId: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

// Composite index to quickly fetch latest version by filename+path
CodeSnapshotSchema.index({ path: 1, filename: 1, version: -1 });

const CodeSnapshot = mongoose.model("CodeSnapshot", CodeSnapshotSchema);

export default CodeSnapshot;
