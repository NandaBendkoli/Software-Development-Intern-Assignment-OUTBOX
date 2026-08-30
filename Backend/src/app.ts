import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "./auth/passport.js";
import env from "dotenv";

env.config();

import "./queue/redis.connection.js";

import authRoutes from "./auth/auth.routes.js";
import compaignRoutes from "./campaign/campaign.routes.js";
import senderRoutes from "./sender/sender.routes.js";
import emailJobRoutes from "./emailJob/emailJob.routes.js";
import csvRoutes from "./campaign/csv.routes.js";

const app = express();

app.set("trust proxy", 1);

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/campaign", compaignRoutes);
app.use("/api/sender", senderRoutes);
app.use("/api/emailJob", emailJobRoutes);
app.use("/api/campaign/csv", csvRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "App is Running",
  });
});

export default app;