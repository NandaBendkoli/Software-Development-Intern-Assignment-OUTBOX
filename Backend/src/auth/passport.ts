import passport from "passport";
import env from "dotenv";
env.config();
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../config/db.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google Profile--", profile);
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const avatar = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error("Google account email not found"));
        }

        let user = await prisma.user.findUnique({
          where: {
            googleId,
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId,
              name,
              email,
              avtar: avatar,
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

export default passport;
