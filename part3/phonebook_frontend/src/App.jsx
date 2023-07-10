import { useState, useEffect, useRef } from 'react';
import { create, del, getAll, update } from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const displayNotification = (message, type = 'notification') => {
    if (timer.current) clearInterval(timer.current);
    setNotification(message);
    setNotificationType(type);
    timer.current = setTimeout(() => {
      setNotification(null);
      setNotificationType(null);
    }, 5000);
  };

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
        try {
          const res = await update({ ...existingPerson, number: newNumber });
          setPersons((prevPersons) =>
            prevPersons.map((p) => (p.id !== existingPerson.id ? p : res.data))
          );
          displayNotification(`${existingPerson.name} phone number updated`);
        } catch (err) {
          if (err.response?.status === 404) {
            displayNotification(
              `Information of ${existingPerson.name} has already been removed from server`,
              'error'
            );
            setPersons((prevPersons) =>
              prevPersons.filter((p) => p.id !== existingPerson.id)
            );
          } else {
            displayNotification(
              err.response?.data?.error || 'Unknown error',
              'error'
            );
            return;
          }
        }
      }
    } else {
      try {
        const res = await create({ name: newName, number: newNumber });
        setPersons((prevPersons) => prevPersons.concat(res.data));
        displayNotification(`Added ${res.data.name}`);
      } catch (err) {
        displayNotification(
          err.response?.data?.error || 'Unknown error',
          'error'
        );
        return;
      }
    }

    setNewName('');
    setNewNumber('');
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notification} type={notificationType} />
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

const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return <div className={`notification-box ${type}`}>{message}</div>;
};
