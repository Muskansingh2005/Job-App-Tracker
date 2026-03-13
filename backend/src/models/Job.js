import mongoose from "mongoose";
import { JOB_STATUSES } from "../utils/constants.js";

const jobSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true, trim: true },
    jobTitle: { type: String, required: true, trim: true },
    jobLink: { type: String, trim: true },
    dateApplied: { type: Date },
    company: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    status: { type: String, enum: JOB_STATUSES, default: "Applied" },
    location: { type: String, trim: true },
    appliedDate: { type: Date, default: Date.now },
    followUpDate: { type: Date },
    interviewDate: { type: Date },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
