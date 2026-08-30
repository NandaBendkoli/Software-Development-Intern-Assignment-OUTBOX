import api from "./api";

export const getAllEmailJobs = async () => {
  const response = await api.get("/emailJob/getAll");

  return response.data;
};

export const getEmailJob = async (id: string) => {
  const response = await api.get(`/emailJob/getOne/${id}`);

  return response.data;
};

export const createEmailJob = async (data: {
  campaignId: string;
  recipient: string;
  scheduledAt: string;
  idempotancyKey: string;
}) => {
  const response = await api.post("/emailJob/create", data);

  return response.data;
};
export const createBulkEmailJobs = async (data: {
  campaignId: string;
  recipients: string[];
}) => {
  const response = await api.post("/emailJob/createBulk", data);

  return response.data;
};
