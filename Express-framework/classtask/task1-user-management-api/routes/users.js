const express = require('express');
const router = express.Router();
const validation = require('../middleware/validation');

let users = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'User' }
];

router.get('/', (req, res) => {
  res.json(users);
});

router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send('User not found');
  res.json(user);
});

router.post('/', validation, (req, res) => {
  const { name, email, role } = req.body;
  const newUser = { id: users.length + 1, name, email, role };
  users.push(newUser);
  res.json(newUser);
});

router.put('/:id', validation, (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send('User not found');
  const { name, email, role } = req.body;
  user.name = name;
  user.email = email;
  user.role = role;
  res.json(user);
});

router.delete('/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send('User not found');
  const deletedUser = users.splice(index, 1);
  res.json(deletedUser[0]);
});

module.exports = router;
