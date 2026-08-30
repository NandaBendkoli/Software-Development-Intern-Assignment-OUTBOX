export type CampaignStatus = "ACTIVE" | "COMPLETED" | "CANCELLED" | "PAUSED";

export interface Campaign {
  id: string;
  userId: string;
  senderId: string;
  subject: string;
  body: string;
  startAt: string;
  delaySeconds: number;
  hourlyLimit: number;
  status: CampaignStatus;

  sender?: {
    id: string;
    name: string;
    email: string;
  };
}


export interface Stats {
  total: number;
  scheduled: number;
  processing: number;
  sent: number;
  failed: number;
}
