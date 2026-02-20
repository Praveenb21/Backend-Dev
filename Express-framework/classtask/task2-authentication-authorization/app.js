const express = require('express');
const app = express();
const PORT = 3001;

const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const authMiddleware = require('./middleware/authMiddleware');

app.use(express.json());

app.use('/login', authRoutes);
app.use(authMiddleware);
app.use('/dashboard', protectedRoutes);
app.use('/profile', protectedRoutes);

app.use((req, res) => {
  res.status(404).send('Route not found');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
