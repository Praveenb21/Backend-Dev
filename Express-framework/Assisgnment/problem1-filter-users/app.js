const express = require('express');
const app = express();
const userRoutes = require('./routes/users');

const PORT = 3000;

app.use(express.json());
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Problem 1 - User Filter API Running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
