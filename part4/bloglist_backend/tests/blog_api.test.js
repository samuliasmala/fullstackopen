const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const { initialBlogs, newBlog, rootUser } = require('./test_helper');

const api = supertest(app);

let token;

beforeAll(async () => {
  await User.deleteMany({});
  const user = new User(rootUser);
  await user.save();
  const res = await api
    .post('/api/login')
    .send({ username: rootUser.username, password: 'sekret' });
  token = res.body.token;
});

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
    .set('Authorization', 'Bearer ' + token)
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
    .set('Authorization', 'Bearer ' + token)
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

test('can delete a blog', async () => {
  const blogToDelete = (await api.get('/api/blogs')).body[0];
  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const res = await api.get('/api/blogs');
  const titles = res.body.map((r) => r.title);
  expect(res.body).toHaveLength(initialBlogs.length - 1);
  expect(titles).not.toContain(blogToDelete.title);
});

test('can update like count', async () => {
  const blogToUpdate = (await api.get('/api/blogs')).body[0];
  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({ ...blogToUpdate, likes: 99 })
    .expect(200);

  const res = await api.get('/api/blogs');
  const blog = res.body.find((blog) => blog.title === blogToUpdate.title);
  expect(blog.likes).toBe(99);
});

afterAll(async () => {
  await mongoose.connection.close();
});
