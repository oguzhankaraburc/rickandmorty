import React, { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';
import axios from 'axios';
const App = () => {
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState(null);

  const fetchAllCharacters = async () => {
    try {
      let allCharacters = [];
      let page = 1;
      let totalPages = 1;

      do {
        const response = await axios.get(`https://rickandmortyapi.com/api/character?page=${page}`);
        allCharacters = [...allCharacters, ...response.data.results];
        totalPages = response.data.info.pages;
        page++;
      } while (page <= totalPages);

      setCharacters(allCharacters);
      setFilteredCharacters(allCharacters);
    } catch (err) {
      setError('Veri alınamadı!');
    }
  };

  useEffect(() => {
    fetchAllCharacters();
  }, []);

  const filterCharacters = () => {
    let filtered = characters;

    if (search) {
      filtered = filtered.filter((char) =>
        char.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (speciesFilter) {
      filtered = filtered.filter((char) => char.species === speciesFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter((char) => char.status === statusFilter);
    }

    setFilteredCharacters(filtered);
  };

  useEffect(() => {
    filterCharacters();
  }, [search, speciesFilter, statusFilter, characters]);

  const toggleCharacterDetails = (character) => {
    if (selectedCharacter && selectedCharacter.id === character.id) {
      setSelectedCharacter(null);
    } else {
      setSelectedCharacter(character);
    }
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentCharacters = filteredCharacters.slice(startIndex, endIndex);

  return (
    <div className="app-container">
      <h1 className="title">Rick and Morty Karakterleri</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Karakter ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
        />
        <select
          onChange={(e) => setSpeciesFilter(e.target.value)}
          className="dropdown"
        >
          <option value="">Tüm Türler</option>
          <option value="Human">Human</option>
          <option value="Alien">Alien</option>
        </select>
        <select
          onChange={(e) => setStatusFilter(e.target.value)}
          className="dropdown"
        >
          <option value="">Tüm Durumlar</option>
          <option value="Alive">Alive</option>
          <option value="Dead">Dead</option>
          <option value="unknown">Unknown</option>
        </select>
        <select
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
          className="dropdown"
        >
          <option value="5">5 sonuç</option>
          <option value="10" selected>10 sonuç</option>
          <option value="20">20 sonuç</option>
          <option value="50">50 sonuç</option>
        </select>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Ad</th>
            <th>Tür</th>
            <th>Durum</th>
            <th>Yaşadığı Yer</th>
          </tr>
        </thead>
        <tbody>
          {currentCharacters.map((char) => (
            <React.Fragment key={char.id}>
              <tr onClick={() => toggleCharacterDetails(char)}>
                <td>{char.name}</td>
                <td>{char.species}</td>
                <td>{char.status}</td>
                <td>{char.location.name}</td>
              </tr>
              {selectedCharacter && selectedCharacter.id === char.id && (
                <tr className="character-details-row">
                  <td colSpan="4">
                    <strong>Detaylar:</strong>
                    <p>Ad: {selectedCharacter.name}</p>
                    <p>Tür: {selectedCharacter.species}</p>
                    <p>Durum: {selectedCharacter.status}</p>
                    <p>Konum: {selectedCharacter.location.name}</p>
                    <img
                      src={selectedCharacter.image}
                      alt={selectedCharacter.name}
                      style={{ maxWidth: '200px', marginTop: '10px' }}
                    />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Önceki
        </button>
        <span>Sayfa: {currentPage}</span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev * rowsPerPage < filteredCharacters.length ? prev + 1 : prev
            )
          }
        >
          Sonraki
        </button>
      </div>
      {filteredCharacters.length === 0 && <p>Hiçbir sonuç bulunamadı!</p>}
    </div>
  );
};

export default App;
