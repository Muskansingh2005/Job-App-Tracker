import client from "./client.js";

export const getJobs = async (params = {}) => {
  const { data } = await client.get("/api/jobs", { params });
  return data;
};

export const getStats = async () => {
  const { data } = await client.get("/api/jobs/stats");
  return data;
};

export const getAnalytics = async () => {
  const { data } = await client.get("/api/jobs/analytics");
  return data;
};

export const getUpcomingInterviews = async (days = 30) => {
  const { data } = await client.get("/api/jobs/interviews", {
    params: { days },
  });
  return data;
};

export const createJob = async (payload) => {
  const { data } = await client.post("/api/jobs", payload);
  return data;
};

export const updateJob = async (id, payload) => {
  const { data } = await client.put(`/api/jobs/${id}`, payload);
  return data;
};

export const updateFollowUpDate = async (id, followUpDate) => {
  const { data } = await client.patch(`/api/jobs/${id}/follow-up`, {
    followUpDate,
  });
  return data;
};

export const deleteJob = async (id) => {
  const { data } = await client.delete(`/api/jobs/${id}`);
  return data;
};
