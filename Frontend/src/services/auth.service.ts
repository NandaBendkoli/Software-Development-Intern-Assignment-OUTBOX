import api from "./api";
import type { AuthResponse } from "../types/auth";

export const getCurrentUser = async (): Promise<AuthResponse> => {
  const response = await api.get("/auth/getUser");

  return response.data;
};

export const logoutUser = async () => {
  const response = await api.get("/auth/logout");

  return response.data;
};

