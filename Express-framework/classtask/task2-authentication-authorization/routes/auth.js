const express = require('express');
const router = express.Router();

const users = [
  { email: 'admin@example.com', password: '1234' },
  { email: 'user@example.com', password: '5678' }
];

router.post('/', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).send('Invalid credentials');
  res.json({ token: 'dummy-token' });
});

module.exports = router;
