// Exercise 1: Request Logging System
// Logs every request to a file with timestamp, method, URL, status, response time

const fs = require("fs");
const path = require("path");

// Make sure logs folder exists, if not create it
const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFilePath = path.join(logDir, "requests.log");

const requestLogger = (req, res, next) => {
  const startTime = Date.now(); // capture when request came in

  // We hook into res.finish event because status code is only
  // available AFTER the response is sent, not before
  res.on("finish", () => {
    const duration = Date.now() - startTime; // how long it took
    const timestamp = new Date().toISOString();

    const logEntry = `[${timestamp}] ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | Time: ${duration}ms\n`;

    // Append to log file (creates file if it doesn't exist)
    fs.appendFile(logFilePath, logEntry, (err) => {
      if (err) console.error("Failed to write log:", err);
    });

    // Also print to console for development visibility
    console.log(logEntry.trim());
  });

  next(); // always call next() so request continues
};

module.exports = requestLogger;
