const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.find({});
    return res.json(blogs);
  } catch (err) {
    next(err);
  }
});

blogsRouter.post('/', async (req, res, next) => {
  try {
    const blog = new Blog(req.body);
    const result = await blog.save();
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = blogsRouter;
