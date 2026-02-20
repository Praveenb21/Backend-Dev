const express = require('express');
const router = express.Router();

let posts = [
  { id: 1, title: "First Post", content: "This is my first blog post" },
  { id: 2, title: "Second Post", content: "Another blog post here" }
];

router.get('/', (req, res) => {
  res.render('blog', { posts });
});

router.get('/new', (req, res) => {
  res.render('new-post');
});

router.post('/', (req, res) => {
  const { title, content } = req.body;

  const newPost = {
    id: posts.length + 1,
    title,
    content
  };

  posts.push(newPost);

  res.redirect('/blog');
});

router.get('/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));

  if (!post) {
    return res.status(404).send('Post not found');
  }

  res.render('post', { post });
});

module.exports = router;
