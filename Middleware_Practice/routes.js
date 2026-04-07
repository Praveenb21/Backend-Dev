// routes.js — Express routes using the User Activity Tracker

const express = require("express");
const router = express.Router();
const User = require("./userModel");

// --- Login Route ---
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // logIn() triggers the pre-save middleware which records login time
    const ipAddress = req.ip || req.connection.remoteAddress;
    await user.logIn(ipAddress);

    res.json({
      message: "Login successful",
      lastLoginAt: user.lastLoginAt,
      loginCount: user.loginCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Logout Route ---
router.post("/logout", async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    // logOut() triggers pre-save middleware which records logout time
    await user.logOut();

    res.json({
      message: "Logout successful",
      lastLogoutAt: user.lastLogoutAt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Update Last Active (call this on every API request) ---
router.use(async (req, res, next) => {
  if (req.user) {
    // If user is authenticated, update their last active timestamp
    await req.user.updateActivity();
  }
  next();
});

// --- Get User Activity Stats ---
router.get("/activity/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      "username lastLoginAt lastLogoutAt lastActiveAt loginCount isOnline loginHistory"
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ activity: user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

/*
  Sample response for GET /activity/:userId :
  {
    "activity": {
      "username": "john_doe",
      "lastLoginAt": "2024-01-15T10:00:00.000Z",
      "lastLogoutAt": "2024-01-15T11:30:00.000Z",
      "lastActiveAt": "2024-01-15T11:25:00.000Z",
      "loginCount": 42,
      "isOnline": false,
      "loginHistory": [
        { "loginTime": "...", "logoutTime": "...", "ipAddress": "192.168.1.1" }
      ]
    }
  }
*/
