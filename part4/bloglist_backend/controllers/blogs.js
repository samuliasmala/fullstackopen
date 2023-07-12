const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

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

  const { user } = req;
  if (!user) return res.status(401).json({ error: 'authentication required' });

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
  const { user } = req;
  if (!user) return res.status(401).json({ error: 'authentication required' });
  const blog = await Blog.findById(req.params.id);

  if (!blog) return res.status(204).end();

  if (blog.user.toString() !== user._id.toString())
    return res.status(401).json({ error: 'can only remove own blogs' });

  await blog.deleteOne();
  return res.status(204).end();
});

module.exports = blogsRouter;
