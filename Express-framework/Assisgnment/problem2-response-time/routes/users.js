const express = require('express');
const router = express.Router();

let users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];

router.get('/', (req, res) => {
  res.json(users);
});

router.post('/', (req, res) => {
  const { name } = req.body;

  const newUser = {
    id: users.length + 1,
    name
  };

  users.push(newUser);

  res.status(201).json(newUser);
});

module.exports = router;
