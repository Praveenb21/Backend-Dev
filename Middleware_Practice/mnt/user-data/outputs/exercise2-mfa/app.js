// app.js — How to use MFA Middleware

const express = require("express");
const jwt = require("jsonwebtoken");
const { mfaMiddleware, generateOTP, verifyJWT } = require("./mfaMiddleware");

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

// --- Route: Login (returns JWT) ---
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // In real app, verify credentials from DB
  if (username === "admin" && password === "password123") {
    const token = jwt.sign({ id: "user_001", username }, JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({ token });
  }

  res.status(401).json({ error: "Invalid credentials" });
});

// --- Route: Request OTP (user must be logged in with JWT) ---
app.post("/request-otp", verifyJWT, (req, res) => {
  const otp = generateOTP(req.user.id);
  // In real app, send OTP via SMS or email — don't return it in response!
  res.json({ message: "OTP sent to your registered phone/email" });
});

// --- Route: Sensitive operation (needs BOTH JWT + OTP) ---
app.post("/transfer-money", mfaMiddleware, (req, res) => {
  // Only reaches here if both JWT and OTP are valid
  res.json({
    success: true,
    message: `Money transferred successfully by ${req.user.username}`,
  });
});

app.post("/delete-account", mfaMiddleware, (req, res) => {
  res.json({ success: true, message: "Account deleted" });
});

app.listen(3000, () => console.log("Server on port 3000"));

/*
  How to test:
  1. POST /login              → get JWT token
  2. POST /request-otp        → get OTP (with Bearer token in header)
  3. POST /transfer-money     → send Bearer token + OTP in body
                                { "otp": "123456" }
*/
