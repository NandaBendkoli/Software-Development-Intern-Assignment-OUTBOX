import api from "./api";

export interface CreateCampaignPayload {
  userId: string;
  senderId: string;
  subject: string;
  body: string;
  startAt: string;
  delaySeconds: number;
  hourlyLimit: number;
}

export const createCampaign = async (data: CreateCampaignPayload) => {
  const response = await api.post("/campaign/create", data);

  return response.data;
};

export const getCampaigns = async () => {
  const response = await api.get("/campaign/getAll");

  return response.data;
};

export const getCampaign = async (id: string) => {
  const response = await api.get(`/campaign/getOne/${id}`);

  return response.data;
};

export const getCampaignStats = async (id: string) => {
  const response = await api.get(`/campaign/stats/${id}`);

  return response.data;
};

export const pauseCampaign = async (id: string) => {
  const response = await api.patch(`/campaign/pause/${id}`);

  return response.data;
};

export const resumeCampaign = async (id: string) => {
  const response = await api.patch(`/campaign/resume/${id}`);

  return response.data;
};

export const cancelCampaign = async (id: string) => {
  const response = await api.patch(`/campaign/cancel/${id}`);

  return response.data;
};
