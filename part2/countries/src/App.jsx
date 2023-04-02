import { useState, useEffect } from 'react';
import { getAll } from './services/countries';
import { getWeather } from './services/weather';

const App = () => {
  const [countryData, setCountryData] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [filter, setFilter] = useState('');
  const [showCountry, setShowCountry] = useState(null);

  const handleFilterChange = (newFilterValue) => {
    const filteredCountries = countryData.filter((country) =>
      country.name.common.toLowerCase().includes(newFilterValue.toLowerCase())
    );

    setCountryList(filteredCountries);
    setShowCountry(
      filteredCountries.length === 1 ? filteredCountries[0] : null
    );
    setFilter(newFilterValue);
  };

  useEffect(() => {
    getAll().then((response) => {
      setCountryData(response.data);
    });
  }, []);

  useEffect(() => {
    if (showCountry) {
      const [lat, lon] = showCountry.capitalInfo.latlng;
      getWeather({ lat, lon }).then((response) => {
        setWeatherData(response.data);
      });
    } else {
      setWeatherData(null);
    }
  }, [showCountry]);

  return (
    <div>
      <Filter filter={filter} setFilter={handleFilterChange} />
      {showCountry ? (
        <Country country={showCountry} weather={weatherData} />
      ) : filter === '' ? null : (
        <CountryList countries={countryList} setShowCountry={setShowCountry} />
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

const CountryList = ({ countries, setShowCountry }) => {
  if (countries.length > 10)
    return (
      <div>Too many matches ({countries.length}), specify another filter</div>
    );

  if (countries.length > 0)
    return countries.map((country) => (
      <div key={country.name.common}>
        {country.name.common}{' '}
        <button onClick={() => setShowCountry(country)}>show</button>
      </div>
    ));

  return 'No match';
};

const Country = ({ country, weather }) => (
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
    <Weather capital={country.capital} weather={weather} />
  </div>
);

const Weather = ({ capital, weather }) => {
  if (!weather) return null;

  return (
    <>
      <h2>Weather in {capital}</h2>
      <div>temperature {weather.main.temp} &#8451;</div>
      {weather.weather.map((w) => (
        <img
          key={w.id}
          src={`https://openweathermap.org/img/wn/${w.icon}@2x.png`}
          title={w.description}
          alt={w.description}
        />
      ))}
      <div>wind {weather.wind.speed} m/s</div>
    </>
  );
};
