require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const Person = require('./models/person');

morgan.token('body', (req, res) =>
  req.method === 'POST' ? JSON.stringify(req.body) : null
);

const tinyWithBody =
  ':method :url :status :res[content-length] - :response-time ms :body';

app.use(express.json());
app.use(morgan(tinyWithBody));
app.use(express.static('dist'));

app.get('/api/persons', async (req, res, next) => {
  try {
    const persons = await Person.find({});
    return res.json(persons);
  } catch (err) {
    next(err);
  }
});

app.post('/api/persons', async (req, res, next) => {
  try {
    const { name, number } = req.body;

    if (!name) return res.status(400).json({ error: 'name is missing' });
    if (!number) return res.status(400).json({ error: 'number is missing' });
    if ((await Person.count({ name })) > 0)
      return res.status(400).json({ error: 'name must be unique' });

    const newPerson = new Person({
      name,
      number,
    });

    const savedPerson = await newPerson.save();
    return res.json(savedPerson);
  } catch (err) {
    next(err);
  }
});

app.get('/api/persons/:id', async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id);

    if (!person) return res.status(404).end();
    return res.json(person);
  } catch (err) {
    next(err);
  }
});

app.put('/api/persons/:id', async (req, res, next) => {
  try {
    const person = { name: req.body.name, number: req.body.number };

    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      person,
      { new: true, runValidators: true, context: 'query' }
    );

    return res.json(updatedPerson);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    await Person.findByIdAndRemove(req.params.id);
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
});

app.get('/info', async (req, res, next) => {
  try {
    const personCount = await Person.count({});
    res.send(`<p>Phonebook has info for ${personCount} people</p>
            <p>${new Date().toString()}</p>`);
  } catch (err) {
    next(err);
  }
});

const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === 'CastError')
    return res.status(400).send({ error: 'malformatted id' });
  else if (err.name === 'ValidationError')
    return res.status(400).json({ error: err.message });

  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (process.env.NODE_ENV === 'development') {
    console.log(`Test frontend: http://localhost:${PORT}`);
    console.log(`Test API: http://localhost:${PORT}/api/persons`);
  }
});
