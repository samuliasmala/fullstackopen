import { useState, useEffect } from 'react';
import { getAll } from './services/countries';

const App = () => {
  const [countryData, setCountryData] = useState([]);
  const [filter, setFilter] = useState('');
  const [showCountry, setShowCountry] = useState(null);

  const handleFilterChange = (newFilterValue) => {
    setShowCountry(null);
    setFilter(newFilterValue);
  };

  useEffect(() => {
    getAll().then((response) => {
      setCountryData(response.data);
    });
  }, []);

  const filteredCountries = countryData.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <Filter filter={filter} setFilter={handleFilterChange} />
      {filter === '' ? null : (
        <CountryList
          countries={filteredCountries}
          showCountry={showCountry}
          setShowCountry={setShowCountry}
        />
      )}
    </div>
  );
};

export default App;

const Filter = ({ filter, setFilter }) => (
  <>
    find countries:
    <input value={filter} onChange={(event) => setFilter(event.target.value)} />
  </>
);

const CountryList = ({ countries, showCountry, setShowCountry }) => {
  if (showCountry) return <Country country={showCountry} />;

  if (countries.length > 10)
    return (
      <div>Too many matches ({countries.length}), specify another filter</div>
    );

  if (countries.length > 1)
    return countries.map((country) => (
      <div key={country.name.common}>
        {country.name.common}{' '}
        <button onClick={() => setShowCountry(country)}>show</button>
      </div>
    ));

  if (countries.length === 1) return <Country country={countries[0]} />;

  return 'No match';
};

const Country = ({ country }) => (
  <div>
    <h1>{country.name.common}</h1>
    <div>capital {country.capital.join(', ')}</div>
    <div>area {country.area}</div>
    <br />
    <div>
      <strong>languages</strong>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
    </div>
    <img className="flag" src={country.flags.svg} alt={country.flags.alt}></img>
  </div>
);
