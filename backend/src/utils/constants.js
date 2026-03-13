export const JOB_STATUS_LABELS = {
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
};

export const JOB_STATUSES = Object.values(JOB_STATUS_LABELS);

export const normalizeJobStatus = (value) => {
  if (!value) return value;
  const lower = String(value).toLowerCase();
  return JOB_STATUS_LABELS[lower] || value;
};
