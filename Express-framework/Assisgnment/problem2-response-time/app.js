const express = require('express');
const app = express();
const userRoutes = require('./routes/users');

const PORT = 3000;

app.use(express.json());

// Response Time Middleware
app.use((req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`${req.method} ${req.originalUrl} - ${duration}ms`);
  });

  next();
});

app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Problem 2 - Response Time Middleware Running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
