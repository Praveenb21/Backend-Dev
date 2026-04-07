// Exercise 2: Multi-Factor Authentication Middleware
// Checks BOTH a JWT token AND a temporary OTP for sensitive routes

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

// In a real app, OTPs would be stored in Redis with expiry
// Here we simulate it with an in-memory Map
const otpStore = new Map();
// Format: otpStore.set(userId, { otp: "123456", expiresAt: timestamp })

// --- Helper: Generate a 6-digit OTP ---
const generateOTP = (userId) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
  const expiresAt = Date.now() + 5 * 60 * 1000; // valid for 5 minutes

  otpStore.set(userId, { otp, expiresAt });

  console.log(`OTP for user ${userId}: ${otp}`); // In real app, send via SMS/Email
  return otp;
};

// --- Step 1: Verify JWT Token ---
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Token should come as: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user info to request for next middleware
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// --- Step 2: Verify OTP ---
const verifyOTP = (req, res, next) => {
  const { otp } = req.body; // OTP comes in request body
  const userId = req.user.id; // user id comes from JWT (set by verifyJWT)

  if (!otp) {
    return res.status(400).json({ error: "OTP is required for this operation" });
  }

  const storedOTPData = otpStore.get(userId);

  // Check if OTP exists
  if (!storedOTPData) {
    return res.status(400).json({ error: "No OTP found. Please request a new one." });
  }

  // Check if OTP is expired
  if (Date.now() > storedOTPData.expiresAt) {
    otpStore.delete(userId); // clean up expired OTP
    return res.status(400).json({ error: "OTP has expired. Please request a new one." });
  }

  // Check if OTP matches
  if (storedOTPData.otp !== otp) {
    return res.status(401).json({ error: "Incorrect OTP" });
  }

  // OTP is valid — delete it so it can't be reused
  otpStore.delete(userId);

  next(); // both checks passed, allow access
};

// Combined MFA middleware — use this on sensitive routes
// It runs verifyJWT first, then verifyOTP
const mfaMiddleware = [verifyJWT, verifyOTP];

module.exports = { mfaMiddleware, generateOTP, verifyJWT };
