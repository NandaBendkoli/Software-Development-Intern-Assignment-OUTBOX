import express from "express";

import passport from "../auth/passport.js";

import {
  failedAuthentication,
  getLogin,
  getUser,
  logoutUser,
} from "./auth.controller.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/failed",
  }),
  getLogin,
);

router.get("/getUser", getUser);

router.get("/logout", logoutUser);

router.get("/failed", failedAuthentication);

export default router;
