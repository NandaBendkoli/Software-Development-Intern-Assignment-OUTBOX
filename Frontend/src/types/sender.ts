export interface Sender {
  id: string;
  userId: string;
  name: string;
  email: string;
  smtpUser: string;
  smtpPassword: string;
  createdAt?: string;
  updatedAt?: string;
}