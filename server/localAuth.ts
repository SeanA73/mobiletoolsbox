import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import connectPg from "connect-pg-simple";
import type { Express, RequestHandler } from "express";
import { randomUUID } from "crypto";
import { storage } from "./storage";

// The shape kept here intentionally mirrors what the old Replit OIDC auth produced
// ({ claims: { sub: userId } }) so every existing route handler that reads
// req.user.claims.sub keeps working unchanged.
type SessionUser = {
  claims: { sub: string };
};

if (!process.env.SESSION_SECRET) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set in production.");
  }
  console.warn("⚠️  SESSION_SECRET not set. Using an insecure default for local development only.");
  process.env.SESSION_SECRET = "dev-secret-change-in-production";
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: sessionTtl,
    },
  });
}

function sanitizeUser(user: Awaited<ReturnType<typeof storage.getUserByEmail>>) {
  if (!user) return null;
  const { password, ...safe } = user as any;
  return safe;
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email: string, password: string, done) => {
        try {
          const user = await storage.getUserByEmail(email.toLowerCase().trim());
          if (!user || !user.password) {
            return done(null, false, { message: "Invalid email or password" });
          }
          const valid = await bcrypt.compare(password, user.password);
          if (!valid) {
            return done(null, false, { message: "Invalid email or password" });
          }
          const sessionUser: SessionUser = { claims: { sub: user.id } };
          return done(null, sessionUser);
        } catch (err) {
          return done(err as Error);
        }
      }
    )
  );

  passport.serializeUser((user: any, cb) => cb(null, user));
  passport.deserializeUser((user: any, cb) => cb(null, user));

  // --- Registration ---
  app.post("/api/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body || {};

      if (!email || typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({ message: "A valid email is required" });
      }
      if (!password || typeof password !== "string" || password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const existing = await storage.getUserByEmail(normalizedEmail);
      if (existing) {
        return res.status(409).json({ message: "An account with that email already exists" });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await storage.createLocalUser({
        id: randomUUID(),
        email: normalizedEmail,
        password: passwordHash,
        firstName,
        lastName,
      });

      const sessionUser: SessionUser = { claims: { sub: user.id } };
      req.login(sessionUser as any, (err) => {
        if (err) {
          console.error("Login after register failed:", err);
          return res.status(500).json({ message: "Account created, but auto-login failed. Please log in." });
        }
        res.status(201).json(sanitizeUser(user));
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to register" });
    }
  });

  // --- Login ---
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: Error | null, sessionUser: SessionUser | false, info: { message?: string }) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Login failed" });
      }
      if (!sessionUser) {
        return res.status(401).json({ message: info?.message || "Invalid email or password" });
      }
      req.login(sessionUser as any, async (loginErr) => {
        if (loginErr) {
          console.error("req.login error:", loginErr);
          return res.status(500).json({ message: "Login failed" });
        }
        const user = await storage.getUser(sessionUser.claims.sub);
        res.json(sanitizeUser(user));
      });
    })(req, res, next);
  });

  // --- Logout ---
  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.json({ success: true });
      });
    });
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated() || !(req.user as any)?.claims?.sub) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
