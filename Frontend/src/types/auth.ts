export interface User {
  id: string;
  name: string;
  email: string;
  avtar?: string | null;
}

export interface AuthResponse {
  success: boolean;
  user: User;
}