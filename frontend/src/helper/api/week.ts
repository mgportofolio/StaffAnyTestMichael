import { getAxiosInstance } from ".";

export const getPublishedWeek = async (weekInterval: string) => {
  const api = getAxiosInstance()
  const { data } = await api.get("/weeks?where[WeekInterval]=" + weekInterval);
  return data;
};

export const publishWeek = async (payload: any) => {
  const api = getAxiosInstance()
  const { data } = await api.post("/weeks", payload);
  return data;
};