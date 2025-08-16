import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    company: { type: String, required: true, index: true },
    location: { type: String, default: "" },
    source: { type: String, default: "LinkedIn", index: true },
    applyLink: { type: String, required: true, unique: true },
    posted: { type: Date, default: Date.now },
    rawPosted: { type: String, default: "" },
    keywords: { type: [String], default: [] },
  },
  { timestamps: true }
);

JobSchema.index({ title: "text", company: "text", location: "text" });

export const Job = mongoose.model("Job", JobSchema);
