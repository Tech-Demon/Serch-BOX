import React, { useState, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/countries.json')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.error('Error loading local data:', error));
  }, []);

  useEffect(() => {
    if (query.length > 2) {
      const filtered = data.filter((country) => {
        const name = country.country?.toLowerCase() || '';
        const capital = country.capital?.toLowerCase() || '';
        return name.includes(query.toLowerCase()) || capital.includes(query.toLowerCase());
      });
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query, data]);

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSelect = (country) => {
    setQuery(country.country);
    setSuggestions([]);
    setSelected(country);
  };

  return (
    <div className="search-bar">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          value={query}
          onChange={handleChange}
          placeholder="Search for a country or capital..."
        />
      </div>
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((country, index) => (
            <li key={index} onClick={() => handleSelect(country)}>
              {country.country} {country.capital ? `- ${country.capital}` : ''}
            </li>
          ))}
        </ul>
      )}
      {selected && (
        <div className="selected-info">
          <h2>{selected.country}</h2>
          {selected.capital && <p>Capital: {selected.capital}</p>}
          <p>Population: {selected.population.toLocaleString()}</p>
          {selected.official_language && (
            <p>Official Language(s): {Array.isArray(selected.official_language) ? selected.official_language.join(', ') : selected.official_language}</p>
          )}
          <p>Currency: {selected.currency}</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
