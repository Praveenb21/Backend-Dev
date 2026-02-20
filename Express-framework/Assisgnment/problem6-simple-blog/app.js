const express = require('express');
const path = require('path');
const blogRoutes = require('./routes/blog');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.use('/blog', blogRoutes);

app.get('/', (req, res) => {
  res.redirect('/blog');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
