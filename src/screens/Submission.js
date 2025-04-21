// Submission.js
import React, { useState, useEffect } from 'react';
import LogoutButton from '../components/LogoutButton';
import Banner from '../components/Banner';
import StudentCard from '../components/StudentCard';

function Submission() {
  const [zadania, setZadania] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedZadanie, setSelectedZadanie] = useState(null);
  const [error, setError] = useState('');
  const [solutionCode, setSolutionCode] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // 🔄 loading stav

  const formatDatum = (datumString) => {
    const datum = new Date(datumString);
    const dd = String(datum.getDate()).padStart(2, '0');
    const mm = String(datum.getMonth() + 1).padStart(2, '0');
    const yyyy = datum.getFullYear();
    const hh = String(datum.getHours()).padStart(2, '0');
    const min = String(datum.getMinutes()).padStart(2, '0');
    return `${dd}.${mm}.${yyyy} ${hh}:${min}`;
  };

  // 🔄 Funkcia na načítanie zadaní
  const fetchZadania = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Nie ste prihlásený. Prihláste sa, prosím.');
      return;
    }

    setLoading(true); // začni loading
    fetch('https://backend-server-6zvl.onrender.com/zadania', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Chyba pri načítavaní zadaní.');
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setZadania(data.zadania);
        } else {
          setError('Chyba pri načítavaní zadaní.');
        }
      })
      .catch((err) => {
        console.error('Chyba pri získavaní zadaní', err);
        setError('Chyba servera');
      })
      .finally(() => {
        setLoading(false); // koniec loadingu
      });
  };

  useEffect(() => {
    fetchZadania();
  }, []);

  const openModal = (zadanie) => {
    setSelectedZadanie(zadanie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedZadanie(null);
    setSubmissionSuccess(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const zadanieId = selectedZadanie.id;

    fetch('https://backend-server-6zvl.onrender.com/odovzdat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        zadanieId,
        kodRiesenia: solutionCode,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setIsModalOpen(false);
          setSubmissionSuccess(true);
          setSolutionCode('');
          fetchZadania(); // 🔄 aktualizuj zoznam po odovzdaní
        } else {
          setError('Chyba pri odovzdávaní zadania.');
        }
      })
      .catch((err) => {
        console.error('Chyba pri odovzdávaní zadania:', err);
        setError('Chyba servera pri odovzdávaní zadania.');
      });
  };

  return (
    <div className="wrapper">
      {error && <p>{error}</p>}
      <Banner />
      <h2 className='zadaniaNazov'>Dostupné zadania:</h2>

      {loading ? (
        <div className="spinner">🔄 Načítavam zadania...</div>
      ) : zadania.length === 0 ? (
        <p>Žiadne zadania na zobrazenie.</p>
      ) : (
        <div className="centered-container">
          <ul>
            {zadania.map((zadanie) => (
              <li key={zadanie.id}>
                <div className="hlavicka">
                  <div className="datum-uzavretia">
                    Deadline: {formatDatum(zadanie.datum_uzavretia)}
                  </div>
                  <div className='nazov'> {zadanie.nazov}</div>
                </div>

                <div className='popis'> {zadanie.popis}</div>

                {/* <div className='stav'>
                  Hodnotenie posledného odovzdania:
                  <div className="stav" style={{ color: '#ff00f5' }}>
                    {zadanie.posledne_odovzdanie_stav
                      ? zadanie.posledne_odovzdanie_stav
                      : 'Zadanie ešte nebolo odovzdané'}
                  </div>
                </div> */}

<div className='stav'>
  Hodnotenie posledného odovzdania:

  {zadanie.posledne_odovzdanie_stav ? (
    (() => {
      let parsedStav;
      try {
        parsedStav = JSON.parse(zadanie.posledne_odovzdanie_stav);
      } catch (e) {
        return <div style={{ color: '#ff00f5' }}>{zadanie.posledne_odovzdanie_stav}</div>;
      }

      return (
        <div className="vysledok" >
          <div>✅ Passed tests: {parsedStav.score}</div>
          <div>📋 Total tests: {parsedStav.total}</div>
          <div>🏁 Final score: {parsedStav.percent}</div>
        </div>
      );
    })()
  ) : (
    <div className="stav" style={{ color: '#ff00f5' }}>
      Zadanie ešte nebolo odovzdané
    </div>
  )}
</div>

                <button onClick={() => openModal(zadanie)}>ODOVZDAŤ</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isModalOpen && selectedZadanie && (
        <div className="modal">
          <div className="modal-content">
            <h3>Odovzdanie pre: {selectedZadanie.nazov}</h3>
            <form onSubmit={handleSubmit}>
              <textarea
                placeholder="Napíšte kód riešenia..."
                rows="10"
                cols="100"
                value={solutionCode}
                onChange={(e) => setSolutionCode(e.target.value)}
              />
               <br />
        {/* 👇 Pridaný input na načítanie súboru */}
        <input
          type="file"
          accept=".py,.txt"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                setSolutionCode(event.target.result);
              };
              reader.readAsText(file);
            }
          }}
        />
        <br />
              <button type="submit">Odovzdať</button>
            </form>
            <button onClick={closeModal}>Zavrieť</button>
          </div>
        </div>
      )}

      {submissionSuccess && (
        <div className="modal">
          <div className="modal-content" style={{ width: '250px' }}>
            <h3>Úspešne ste odovzdali zadanie!</h3>
            <button onClick={closeModal}>Zavrieť</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Submission;
