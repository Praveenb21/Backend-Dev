const express = require('express');
const router = express.Router();

const users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@gmail.com" },
  { id: 3, name: "Charlie", email: "charlie@yahoo.com" },
  { id: 4, name: "David", email: "david@example.com" }
];

router.get('/', (req, res) => {
  const { name, email } = req.query;

  let filteredUsers = users;

  if (name) {
    filteredUsers = filteredUsers.filter(user =>
      user.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (email) {
    filteredUsers = filteredUsers.filter(user =>
      user.email.toLowerCase().includes(email.toLowerCase())
    );
  }

  if (filteredUsers.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No users found"
    });
  }

  res.status(200).json({
    success: true,
    count: filteredUsers.length,
    data: filteredUsers
  });
});

module.exports = router;
