export interface EmailJob {
  id: string;
  campaignId: string;
  recipient: string;
  scheduledAt: string;
  sentAt: string | null;
  status: "SCHEDULED" | "PROCESSING" | "SENT" | "FAILED";

  campaign?: {
    subject: string;
    body: string;
    status: "ACTIVE" | "COMPLETED" | "CANCELLED" | "PAUSED";
  };
}
