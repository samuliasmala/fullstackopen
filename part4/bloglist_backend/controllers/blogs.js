const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  return res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
  if (req.body.title === undefined || req.body.url === undefined)
    return res.status(400).json({ error: 'title and url are required' });

  const blog = new Blog({ likes: 0, ...req.body });
  const result = await blog.save();
  return res.status(201).json(result);
});

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id);
  return res.status(204).end();
});

module.exports = blogsRouter;
