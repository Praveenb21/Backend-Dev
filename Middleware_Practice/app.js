// app.js — How to use the request logger middleware

const express = require("express");
const requestLogger = require("./requestLogger");

const app = express();

// Register logger FIRST — before any routes
// So every single request gets logged
app.use(requestLogger);

app.get("/", (req, res) => {
  res.send("Home page");
});

app.get("/users", (req, res) => {
  res.json({ users: ["Alice", "Bob", "Charlie"] });
});

app.get("/error-test", (req, res) => {
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

/*
  Sample log output in logs/requests.log :

  [2024-01-15T10:23:45.123Z] GET / | Status: 200 | Time: 5ms
  [2024-01-15T10:23:46.456Z] GET /users | Status: 200 | Time: 12ms
  [2024-01-15T10:23:47.789Z] GET /error-test | Status: 500 | Time: 3ms
*/
