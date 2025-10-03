import express from "express";
import type { Request, Response } from "express";
import session from "express-session";

// Extend express-session to add custom types to session
declare module "express-session" {
  interface SessionData {
    views?: number;
    userId?: string;
  }
}

const app = express();

// Middleware for sessions
app.use(
  session({
    secret: "mySuperSecretKey", // Use env variable in production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 15 } // 15 min
  })
);

app.get("/", (req: Request, res: Response) => {
  if (req.session.views) {
    req.session.views++;
  } else {
    req.session.views = 1;
  }
  res.send(`Page views: ${req.session.views}`);
  //res.send(`Session ID: ${req.session.userId || "Not logged in"}`);
});

app.get("/login", (req: Request, res: Response) => {
  req.session.userId = "user123";
  res.send("User logged in, session started!");
});

app.get("/profile", (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(401).send("Not logged in");
  }
  res.send(`Welcome back, user ${req.session.userId}`);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});