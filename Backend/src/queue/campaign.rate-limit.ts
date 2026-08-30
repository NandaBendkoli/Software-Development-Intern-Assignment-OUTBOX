import redisConnection from "./redis.connection.js";

export const checkCampaignRateLimit = async (
  campaignId: string,
  hourlyLimit: number,
) => {
  const key = `campaign:${campaignId}:hourly-limit`;

  const currentCount = await redisConnection.incr(key);

  // ? email starts the 1-hour window
  if (currentCount === 1) {
    await redisConnection.expire(key, 3600);
  }

  if (currentCount > hourlyLimit) {
    await redisConnection.decr(key);
    return false;
  }

  return true;
};
