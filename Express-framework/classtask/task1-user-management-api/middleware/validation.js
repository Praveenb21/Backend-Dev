module.exports = (req, res, next) => {
  const { name, email, role } = req.body;
  if (!name || !email || !role) return res.status(400).send('Invalid input');
  next();
};
