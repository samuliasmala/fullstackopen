import { useState, useEffect } from 'react';
import { create, del, getAll, update } from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const addNewName = async (event) => {
    event.preventDefault();
    if (newName === '') return;

    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      if (
        window.confirm(
          `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const res = await update({ ...existingPerson, number: newNumber });
        setPersons((prevPersons) =>
          prevPersons.map((p) => (p.id !== existingPerson.id ? p : res.data))
        );
      }
    } else {
      const res = await create({ name: newName, number: newNumber });
      setPersons((prevPersons) => prevPersons.concat(res.data));
    }

    setNewName('');
    setNewNumber('');
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter filter={filter} setFilter={setFilter} />
      <h2>add a new</h2>
      <PersonForm
        addNewName={addNewName}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} setPersons={setPersons} />
    </div>
  );
};

export default App;

const Filter = ({ filter, setFilter }) => (
  <>
    filter shown with:
    <input value={filter} onChange={(event) => setFilter(event.target.value)} />
  </>
);

const PersonForm = ({
  addNewName,
  newName,
  setNewName,
  newNumber,
  setNewNumber,
}) => (
  <form onSubmit={addNewName}>
    <div>
      name:
      <input
        value={newName}
        onChange={(event) => setNewName(event.target.value)}
      />
      <div>
        number:
        <input
          value={newNumber}
          onChange={(event) => setNewNumber(event.target.value)}
        />
      </div>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Persons = ({ persons, filter, setPersons }) => {
  const deletePerson = (person) => async () => {
    if (!window.confirm(`Delete ${person.name}?`)) return;
    await del(person.id);
    setPersons((prevPersons) => prevPersons.filter((p) => p.id !== person.id));
  };

  return persons
    .filter(
      (person) =>
        filter === '' ||
        person.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0
    )
    .map((person) => (
      <div key={person.id}>
        {person.name} {person.number}{' '}
        <button onClick={deletePerson(person)}>delete</button>
      </div>
    ));
};
