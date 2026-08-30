export type EmailStatus = "SCHEDULED" | "SENT" | "FAILED" | "PROCESSING";

export interface Email {
  id: string;
  to: string;
  subject: string;
  body?: string;
  status: EmailStatus;
  scheduledAt?: string;
  sentAt?: string;
  createdAt?: string;
}
