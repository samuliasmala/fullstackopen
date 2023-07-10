const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const { initialBlogs, newBlog } = require('./test_helper');

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

test('can add a new blog', async () => {
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const res = await api.get('/api/blogs');
  const titles = res.body.map((r) => r.title);

  expect(res.body).toHaveLength(initialBlogs.length + 1);
  expect(titles).toContain(newBlog.title);
});

test('default likes is 0 for new blogs', async () => {
  const res = await api
    .post('/api/blogs')
    .send({ ...newBlog, likes: undefined })
    .expect(201)
    .expect('Content-Type', /application\/json/);
  expect(res.body.likes).toBe(0);
});

test('a new blog requires title and url', async () => {
  await api
    .post('/api/blogs')
    .send({ ...newBlog, title: undefined })
    .expect(400)
    .expect('Content-Type', /application\/json/);

  await api
    .post('/api/blogs')
    .send({ ...newBlog, url: undefined })
    .expect(400)
    .expect('Content-Type', /application\/json/);
});

afterAll(async () => {
  await mongoose.connection.close();
});
