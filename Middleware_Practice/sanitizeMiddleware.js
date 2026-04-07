// Exercise 5: Data Sanitization Middleware
// Cleans user input to prevent XSS attacks and NoSQL/SQL injection

// npm install express-mongo-sanitize xss helmet

const xss = require("xss");

// -------------------------------------------------------
// HELPER FUNCTIONS
// -------------------------------------------------------

// Recursively sanitize all string values in an object
// Works for nested objects and arrays too
const deepSanitize = (obj) => {
  if (typeof obj === "string") {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepSanitize(item));
  }

  if (obj !== null && typeof obj === "object") {
    const cleaned = {};
    for (const key in obj) {
      // Also sanitize keys — prevent MongoDB operator injection via keys
      const cleanKey = sanitizeKey(key);
      cleaned[cleanKey] = deepSanitize(obj[key]);
    }
    return cleaned;
  }

  return obj; // numbers, booleans etc pass through unchanged
};

// Sanitize a single string value — removes XSS vectors
const sanitizeString = (str) => {
  // Step 1: Use xss library to strip/escape HTML tags and JS events
  let clean = xss(str, {
    whiteList: {},         // allow NO HTML tags at all
    stripIgnoreTag: true,  // remove unknown tags entirely
    stripIgnoreTagBody: ["script", "style"], // remove script/style content too
  });

  // Step 2: Remove NoSQL injection operators like $where, $gt embedded in strings
  clean = clean.replace(/\$[a-zA-Z]+/g, "");

  // Step 3: Remove null bytes (can cause issues in C-based systems)
  clean = clean.replace(/\0/g, "");

  // Step 4: Trim whitespace
  clean = clean.trim();

  return clean;
};

// Sanitize object keys — prevent MongoDB operator injection via key names
const sanitizeKey = (key) => {
  // MongoDB operators start with $ — strip them from keys
  // Also strip dots which can be used for nested query injection
  return key.replace(/^\$/, "").replace(/\./g, "_");
};

// -------------------------------------------------------
// MAIN SANITIZATION MIDDLEWARE
// -------------------------------------------------------

const sanitizeInput = (req, res, next) => {
  try {
    // Sanitize request body
    if (req.body) {
      req.body = deepSanitize(req.body);
    }

    // Sanitize query parameters (?name=<script>alert(1)</script>)
    if (req.query) {
      req.query = deepSanitize(req.query);
    }

    // Sanitize URL params (/users/:id)
    if (req.params) {
      req.params = deepSanitize(req.params);
    }

    next();
  } catch (err) {
    console.error("Sanitization error:", err);
    next(); // even if sanitization fails, don't crash the server
  }
};

// -------------------------------------------------------
// CONTENT TYPE GUARD — reject non-JSON bodies on API routes
// -------------------------------------------------------

const enforceJSON = (req, res, next) => {
  // Only check POST, PUT, PATCH requests that have a body
  if (["POST", "PUT", "PATCH"].includes(req.method) && req.body) {
    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("application/json")) {
      return res.status(415).json({
        error: "Content-Type must be application/json",
      });
    }
  }
  next();
};

// -------------------------------------------------------
// INPUT LENGTH LIMITER — prevent massive payloads
// -------------------------------------------------------

const limitInputLength = (maxLength = 10000) => {
  return (req, res, next) => {
    const bodySize = JSON.stringify(req.body || {}).length;
    if (bodySize > maxLength) {
      return res.status(413).json({
        error: `Request body too large. Max allowed: ${maxLength} characters`,
      });
    }
    next();
  };
};

// -------------------------------------------------------
// SQL INJECTION PATTERN DETECTOR
// (useful even in NoSQL apps when raw queries or search might be used)
// -------------------------------------------------------

const SQL_INJECTION_PATTERNS = [
  /(\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/i,
  /(-{2}|\/\*|\*\/)/,           // SQL comments: -- or /* */
  /(\bOR\b\s+\d+=\d+)/i,        // OR 1=1 pattern
  /(\bUNION\b\s+\bSELECT\b)/i,  // UNION SELECT
  /xp_\w+/i,                    // SQL Server stored procedures
];

const detectSQLInjection = (req, res, next) => {
  const inputToCheck = JSON.stringify({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  for (const pattern of SQL_INJECTION_PATTERNS) {
    if (pattern.test(inputToCheck)) {
      console.warn(`Potential SQL injection attempt from IP: ${req.ip}`);
      return res.status(400).json({
        error: "Invalid input detected",
      });
    }
  }

  next();
};

module.exports = {
  sanitizeInput,
  enforceJSON,
  limitInputLength,
  detectSQLInjection,
};
