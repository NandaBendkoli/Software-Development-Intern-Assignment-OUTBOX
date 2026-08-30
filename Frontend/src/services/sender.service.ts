import api from "./api";
import type { Sender } from "../types/sender";

export const getAllSenders = async (): Promise<{
  success: boolean;
  senders: Sender[];
}> => {
  const response = await api.get("/sender/getAll");

  return response.data;
};

export const createSender = async (data: {
  userId: string;
  name: string;
  email: string;
  smtpUser: string;
  smtpPassword: string;
}) => {
  const response = await api.post("/sender/create", data);

  return response.data;
};