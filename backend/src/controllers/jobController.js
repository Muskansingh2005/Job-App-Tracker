import Job from "../models/Job.js";
import { JOB_STATUSES, normalizeJobStatus } from "../utils/constants.js";

export const createJob = async (req, res, next) => {
  try {
    const {
      companyName,
      jobTitle,
      jobLink,
      dateApplied,
      company,
      position,
      status,
      location,
      appliedDate,
      followUpDate,
      interviewDate,
      notes,
    } = req.body;

    const resolvedCompany = companyName || company;
    const resolvedTitle = jobTitle || position;

    if (!resolvedCompany || !resolvedTitle) {
      return res
        .status(400)
        .json({ message: "Company name and job title are required" });
    }

    const normalizedStatus = normalizeJobStatus(status);

    if (normalizedStatus && !JOB_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const resolvedAppliedDate = dateApplied || appliedDate;

    const job = await Job.create({
      user: req.user._id,
      companyName: resolvedCompany,
      jobTitle: resolvedTitle,
      jobLink,
      dateApplied: resolvedAppliedDate,
      company: resolvedCompany,
      position: resolvedTitle,
      status: normalizedStatus,
      location,
      appliedDate: resolvedAppliedDate,
      followUpDate,
      interviewDate,
      notes,
    });

    return res.status(201).json(job);
  } catch (error) {
    console.error("❌ Create job error:", error);
    next(error);
  }
};

export const getJobs = async (req, res, next) => {
  try {
    const { search = "", status = "", sort = "newest" } = req.query;

    const query = { user: req.user._id };

    const normalizedStatus = normalizeJobStatus(status);

    if (normalizedStatus && JOB_STATUSES.includes(normalizedStatus)) {
      query.status = normalizedStatus;
    }

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { jobTitle: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { position: { $regex: search, $options: "i" } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "company") sortOption = { company: 1 };

    const jobs = await Job.find(query).sort(sortOption);
    return res.json(jobs);
  } catch (error) {
    console.error("❌ Get jobs error:", error);
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (Object.prototype.hasOwnProperty.call(updates, "companyName")) {
      updates.company = updates.companyName;
    }

    if (Object.prototype.hasOwnProperty.call(updates, "jobTitle")) {
      updates.position = updates.jobTitle;
    }

    if (Object.prototype.hasOwnProperty.call(updates, "dateApplied")) {
      updates.appliedDate = updates.dateApplied;
    }

    if (Object.prototype.hasOwnProperty.call(updates, "followUpDate")) {
      updates.followUpDate = updates.followUpDate
        ? new Date(updates.followUpDate)
        : null;
    }

    if (Object.prototype.hasOwnProperty.call(updates, "interviewDate")) {
      updates.interviewDate = updates.interviewDate
        ? new Date(updates.interviewDate)
        : null;
    }

    if (updates.status) {
      updates.status = normalizeJobStatus(updates.status);
    }

    if (updates.status && !JOB_STATUSES.includes(updates.status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const job = await Job.findOneAndUpdate(
      { _id: id, user: req.user._id },
      updates,
      { new: true, runValidators: true },
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.json(job);
  } catch (error) {
    console.error("❌ Update job error:", error);
    next(error);
  }
};

export const getUpcomingInterviews = async (req, res, next) => {
  try {
    const days = Number(req.query.days) || 30;
    const now = new Date();
    const until = new Date();
    until.setDate(now.getDate() + days);

    const interviews = await Job.find({
      user: req.user._id,
      interviewDate: { $gte: now, $lte: until },
    })
      .sort({ interviewDate: 1 })
      .select("company position status interviewDate location");

    return res.json(interviews);
  } catch (error) {
    console.error("❌ Get upcoming interviews error:", error);
    next(error);
  }
};

export const updateFollowUpDate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { followUpDate } = req.body;
    const nextDate = followUpDate ? new Date(followUpDate) : null;

    if (followUpDate && Number.isNaN(nextDate.getTime())) {
      return res.status(400).json({ message: "Invalid follow-up date" });
    }

    const job = await Job.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { followUpDate: nextDate },
      { new: true, runValidators: true },
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.json(job);
  } catch (error) {
    console.error("❌ Update follow-up date error:", error);
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Job.findOneAndDelete({ _id: id, user: req.user._id });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.json({ message: "Job deleted" });
  } catch (error) {
    console.error("❌ Delete job error:", error);
    next(error);
  }
};

export const getStats = async (req, res) => {
  const stats = await Job.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const byStatus = JOB_STATUSES.reduce((acc, status) => {
    const stat = stats.find((item) => item._id === status);
    acc[status] = stat ? stat.count : 0;
    return acc;
  }, {});

  const total = Object.values(byStatus).reduce((sum, value) => sum + value, 0);

  return res.json({ total, byStatus });
};

export const getAnalytics = async (req, res) => {
  const userId = req.user._id;
  const total = await Job.countDocuments({ user: userId });

  const statusStats = await Job.aggregate([
    { $match: { user: userId } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const byStatus = JOB_STATUSES.reduce((acc, status) => {
    const stat = statusStats.find((item) => item._id === status);
    acc[status] = stat ? stat.count : 0;
    return acc;
  }, {});

  const rate = (value) =>
    total ? Number(((value / total) * 100).toFixed(1)) : 0;

  const rates = {
    interview: rate(byStatus.Interviewing),
    offer: rate(byStatus.Offer),
    rejected: rate(byStatus.Rejected),
  };

  const since = new Date();
  since.setDate(since.getDate() - 7 * 12);

  const weekly = await Job.aggregate([
    { $match: { user: userId, createdAt: { $gte: since } } },
    {
      $group: {
        _id: {
          year: { $isoWeekYear: "$createdAt" },
          week: { $isoWeek: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.week": 1 } },
  ]);

  const weeklyCounts = weekly.map((item) => ({
    week: `${item._id.year}-W${String(item._id.week).padStart(2, "0")}`,
    count: item.count,
  }));

  return res.json({ total, weeklyCounts, rates });
};
