const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const { usersInDb, rootUser } = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
});

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    const user = new User(rootUser);
    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('expected `username` to be unique');

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if username is not specified or too short', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'ml',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    const res1 = await api
      .post('/api/users')
      .send({ ...newUser, username: undefined })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(res1.body.error).toContain(
      'User validation failed: username: Path `username` is required.'
    );

    const res2 = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(res2.body.error).toContain(
      'User validation failed: username: Path `username` (`' +
        newUser.username +
        '`) is shorter than the minimum allowed length (3).'
    );

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if password is too short or missing', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'sa',
    };

    const res1 = await api
      .post('/api/users')
      .send({ ...newUser, password: undefined })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(res1.body.error).toContain('password is mandatory');

    const res2 = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(res2.body.error).toContain('password must at least 3 characters');

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
