const express = require('express');
const app = express();
const PORT = 3000;

const userRoutes = require('./routes/users');
const logger = require('./middleware/logger');

app.use(express.json());
app.use(logger);

app.use('/users', userRoutes);

app.use((req, res) => {
  res.status(404).send('Route not found');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
