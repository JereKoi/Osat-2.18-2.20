import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherInfo = ({ country }) => {
  const [weather, setWeather] = useState(null);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const api_key = import.meta.env.VITE_WEATHER_API_KEY; // Olettaen että .env tiedostosi sisältää avaimen
    setApiKey(api_key);
  }, []);

  useEffect(() => {
    if (country) {
      const capital = country.capital[0];
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`;
      axios
        .get(url)
        .then((response) => {
          setWeather(response.data);
        })
        .catch((error) => {
          console.error('Error fetching weather data:', error);
        });
    }
  }, [country, apiKey]);

  if (!weather) {
    return null;
  }

  // Muodosta URL sääikonille käyttäen ikonikoodia säädokumentaatiosta
  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;

  return (
    <div>
      <h3>Weather in {country.capital[0]}</h3>
      <p>Temperature: {weather.main.temp}°C</p>
      <p>Description: {weather.weather[0].description}</p>
      {/* Näytä sääikoni */}
      <img src={iconUrl} alt="Weather icon" />
    </div>
  );
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [countryDetails, setCountryDetails] = useState(null);

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
      });
  }, []);

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setSearch(searchTerm);

    const filtered = countries.filter((country) =>
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filtered.length > 10) {
      setFilteredCountries([]);
      setCountryDetails(null);
    } else if (filtered.length === 1) {
      setFilteredCountries([]);
      setCountryDetails(filtered[0]);
    } else {
      setFilteredCountries(filtered);
      setCountryDetails(null);
    }
  };

  const handleShowDetails = (country) => {
    setFilteredCountries([]);
    setCountryDetails(country);
  };

  return (
    <div>
      <h1>Country Information</h1>
      <div>
        Find countries: <input value={search} onChange={handleSearchChange} />
      </div>
      {filteredCountries.length > 0 ? (
        filteredCountries.map((country) => (
          <div key={country.cca3}>
            {country.name.common}
            <button onClick={() => handleShowDetails(country)}>Show</button>
          </div>
        ))
      ) : countryDetails ? (
        <div>
          <h2>{countryDetails.name.common}</h2>
          <img
            src={countryDetails.flags.png}
            alt="Flag"
            style={{ width: '100px' }}
          />
          <p>Population: {countryDetails.population}</p>
          <p>Languages: {Object.values(countryDetails.languages).join(', ')}</p>
          <WeatherInfo country={countryDetails} />
        </div>
      ) : search.length > 0 ? (
        <div>No matching countries</div>
      ) : null}
      {filteredCountries.length > 10 && (
        <div>Too many countries, specify another filter</div>
      )}
    </div>
  );
};

export default App;
