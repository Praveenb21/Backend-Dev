// Exercise 3: User Activity Tracker
// Uses Mongoose middleware to automatically track login, logout, and last active time

const mongoose = require("mongoose");

// --- User Schema ---
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true },
  password: { type: String, required: true },

  // Activity tracking fields — updated automatically by middleware
  lastLoginAt:    { type: Date, default: null },
  lastLogoutAt:   { type: Date, default: null },
  lastActiveAt:   { type: Date, default: null },
  loginCount:     { type: Number, default: 0 },
  isOnline:       { type: Boolean, default: false },

  // Store login history (last 10 logins)
  loginHistory: [
    {
      loginTime:  Date,
      logoutTime: Date,
      ipAddress:  String,
    },
  ],
});

// -------------------------------------------------------
// MONGOOSE MIDDLEWARE (Document middleware)
// -------------------------------------------------------

// --- Pre-save middleware: runs before every .save() ---
// We use this to detect if user is logging in (isOnline changed to true)
userSchema.pre("save", function (next) {
  // 'this' refers to the current document being saved

  // If isOnline was just set to true — it means user logged in
  if (this.isModified("isOnline") && this.isOnline === true) {
    this.lastLoginAt = new Date();
    this.loginCount += 1;
    this.lastActiveAt = new Date();

    // Add entry to login history
    this.loginHistory.push({
      loginTime: this.lastLoginAt,
      ipAddress: this._loginIP || "unknown", // set this before calling .save()
    });

    // Keep only last 10 login records
    if (this.loginHistory.length > 10) {
      this.loginHistory = this.loginHistory.slice(-10);
    }

    console.log(`User ${this.username} logged in at ${this.lastLoginAt}`);
  }

  // If isOnline was just set to false — it means user logged out
  if (this.isModified("isOnline") && this.isOnline === false) {
    this.lastLogoutAt = new Date();

    // Update the last login history entry with logout time
    if (this.loginHistory.length > 0) {
      this.loginHistory[this.loginHistory.length - 1].logoutTime =
        this.lastLogoutAt;
    }

    console.log(`User ${this.username} logged out at ${this.lastLogoutAt}`);
  }

  next();
});

// --- Post-save middleware: runs after every .save() ---
userSchema.post("save", function (doc) {
  console.log(`Activity updated for user: ${doc.username}`);
});

// -------------------------------------------------------
// INSTANCE METHODS — called on individual user documents
// -------------------------------------------------------

// Call this whenever user does any action (API call, page visit etc.)
userSchema.methods.updateActivity = async function () {
  this.lastActiveAt = new Date();
  await this.save();
};

// Convenience method to log user in
userSchema.methods.logIn = async function (ipAddress) {
  this._loginIP = ipAddress; // temporary field, not saved to DB
  this.isOnline = true;
  await this.save();
};

// Convenience method to log user out
userSchema.methods.logOut = async function () {
  this.isOnline = false;
  await this.save();
};

const User = mongoose.model("User", userSchema);

module.exports = User;
