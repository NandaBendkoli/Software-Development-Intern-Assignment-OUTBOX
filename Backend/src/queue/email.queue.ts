import { Queue } from "bullmq";

import redisConnection from "./redis.connection.js";

const emailQueue = new Queue("email-queue", {
  connection: redisConnection,

  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 5000,
    },

    removeOnComplete: 100,
    removeOnFail: 100,
  },
});

emailQueue.on("error", (error) => {
  console.error("Email Queue Error:", error);
});

export default emailQueue;