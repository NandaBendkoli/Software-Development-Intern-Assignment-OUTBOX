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

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// session
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/campaign", compaignRoutes);
app.use("/api/sender", senderRoutes);
app.use("/api/emailJob", emailJobRoutes);
app.use("/api/campaign/csv", csvRoutes);

app.get("/", (req, res) => {
  //   res.send("Welocme");
  res.status(200).json({
    success: true,
    message: "App is Running",
  });
});

export default app;
