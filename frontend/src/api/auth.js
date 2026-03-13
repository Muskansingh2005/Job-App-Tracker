import client from "./client.js";

export const registerUser = async (payload) => {
  const { data } = await client.post("/api/auth/register", payload);
  return data;
};

export const loginUser = async (payload) => {
  const { data } = await client.post("/api/auth/login", payload);
  return data;
};
