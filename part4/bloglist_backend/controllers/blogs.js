const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  });
  return res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
  if (req.body.title === undefined || req.body.url === undefined)
    return res.status(400).json({ error: 'title and url are required' });

  const users = await User.find({});
  const user = users[0];

  const blog = new Blog({ likes: 0, user: user.id, ...req.body });
  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  return res.status(201).json(savedBlog);
});

blogsRouter.put('/:id', async (req, res) => {
  const { title, author, url, likes } = req.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { title, author, url, likes },
    { new: true }
  );

  if (!updatedBlog) return res.status(404).end();

  return res.status(200).json(updatedBlog);
});

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id);
  return res.status(204).end();
});

module.exports = blogsRouter;
