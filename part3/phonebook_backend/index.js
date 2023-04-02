const express = require('express');
const app = express();
const morgan = require('morgan');

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

morgan.token('body', (req, res) =>
  req.method === 'POST' ? JSON.stringify(req.body) : null
);

const tinyWithBody =
  ':method :url :status :res[content-length] - :response-time ms :body';

app.use(express.json());
app.use(morgan(tinyWithBody));

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name) return res.status(400).json({ error: 'name is missing' });
  if (!number) return res.status(400).json({ error: 'number is missing' });
  if (persons.some((p) => p.name === name))
    return res.status(400).json({ error: 'name must be unique' });

  const person = {
    name,
    number,
    id: getRandomInt(1000000000),
  };

  persons = persons.concat(person);
  res.json(person);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);
  if (!person) return res.status(404).end();
  res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);
  res.status(204).end();
});

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date().toString()}</p>`);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test API: http://localhost:${PORT}/api/persons`);
});
