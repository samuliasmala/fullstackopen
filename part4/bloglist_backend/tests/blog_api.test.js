const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const { initialBlogs } = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all blogs are returned', async () => {
  const res = await api.get('/api/blogs');
  expect(res.body).toHaveLength(initialBlogs.length);
});

test('all blogs have id field', async () => {
  const res = await api.get('/api/blogs');
  res.body.forEach((blog) => expect(blog.id).toBeDefined());
});

afterAll(async () => {
  await mongoose.connection.close();
});
