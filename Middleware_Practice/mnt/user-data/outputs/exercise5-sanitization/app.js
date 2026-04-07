// app.js — Full setup with all sanitization middleware applied

const express = require("express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const {
  sanitizeInput,
  enforceJSON,
  limitInputLength,
  detectSQLInjection,
} = require("./sanitizeMiddleware");

const app = express();

// --- Parse JSON bodies ---
app.use(express.json({ limit: "10kb" })); // also limit at express level

// -------------------------------------------------------
// SECURITY MIDDLEWARE STACK (order matters!)
// -------------------------------------------------------

// 1. Helmet — sets secure HTTP headers (prevents clickjacking, sniffing etc.)
app.use(helmet());

// 2. MongoDB sanitization — removes $ and . from keys (prevents NoSQL injection)
app.use(mongoSanitize());

// 3. Our custom sanitization — cleans all string values (XSS prevention)
app.use(sanitizeInput);

// 4. SQL injection pattern detector
app.use(detectSQLInjection);

// 5. Input length limiter — prevent 50MB JSON bombs
app.use(limitInputLength(5000));

// -------------------------------------------------------
// ROUTES
// -------------------------------------------------------

app.post("/register", (req, res) => {
  // By this point, req.body is already fully sanitized
  const { username, email, password } = req.body;

  console.log("Sanitized input:", { username, email });

  res.json({
    message: "User registered successfully",
    received: { username, email },
  });
});

app.get("/search", (req, res) => {
  // req.query is also sanitized
  const { q } = req.query;
  console.log("Search query (sanitized):", q);
  res.json({ searchTerm: q });
});

app.listen(3000, () => console.log("Secure server running on port 3000"));

/*
  Test cases — these inputs are SANITIZED before reaching your route:
  
  Input:  { "username": "<script>alert('xss')</script>" }
  Output: { "username": "" }   ← script tag removed
  
  Input:  { "$where": "malicious code" }
          → key "$where" becomes "where" ($ stripped by mongoSanitize)
  
  Input:  { "name": "'; DROP TABLE users; --" }
          → SQL injection detected, 400 error returned
  
  Input:  { "comment": "Hello <b>World</b>" }
  Output: { "comment": "Hello World" }  ← HTML stripped
*/
