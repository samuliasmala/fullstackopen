import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/persons').then((response) => {
      setPersons(response.data);
    });
  }, []);

  const addNewName = (event) => {
    event.preventDefault();
    if (newName === '') return;

    if (persons.some((person) => person.name === newName))
      return alert(`${newName} is already added to phonebook`);

    setPersons((prevPersons) =>
      prevPersons.concat({
        id: prevPersons.length + 1,
        name: newName,
        number: newNumber,
      })
    );
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
      <Persons persons={persons} filter={filter} />
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

const Persons = ({ persons, filter }) =>
  persons
    .filter(
      (person) =>
        filter === '' ||
        person.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0
    )
    .map((person) => (
      <div key={person.id}>
        {person.name} {person.number}
      </div>
    ));
