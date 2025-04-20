// Home.js
import React, { useState, useEffect } from 'react';
import LogoutButton from '../components/LogoutButton';
import Banner from '../components/Banner';
import StudentCard from '../components/StudentCard';
function Submission() {
  // Stavy pre zoznam zadania a stav modálneho okna
  const [zadania, setZadania] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedZadanie, setSelectedZadanie] = useState(null);
  const [error, setError] = useState('');
  const [solutionCode, setSolutionCode] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Načítanie zadania zo servera
  useEffect(() => {
    // Získame token z localStorage
    const token = localStorage.getItem('token');
  
    if (!token) {
      setError('Nie ste prihlásený. Prihláste sa, prosím.');
      return;
    }
  
    // Načítame zadania z API
    fetch('https://backend-server-6zvl.onrender.com/zadania', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Posielame token v hlavičke
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
          setZadania(data.zadania); // Uložíme zadania do stavu
        } else {
          setError('Chyba pri načítavaní zadaní.');
        }
      })
      .catch((err) => {
        console.error('Chyba pri získavaní zadaní', err);
        setError('Chyba servera');
      });
  }, []);
  

  // Funkcia na otvorenie modálneho okna
  const openModal = (zadanie) => {
    setSelectedZadanie(zadanie);
    setIsModalOpen(true);
  };

  // Zatvorenie modálneho okna
  const closeModal = () => {
    setIsModalOpen(false); // Zatvorí modálne okno pre zadanie
    setSelectedZadanie(null); // Resetne vybrané zadanie
    setSubmissionSuccess(false); // Resetne úspešný stav odovzdania
  };

 

  // Funkcia na odovzdanie zadania
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
          // Zavrieť modálne okno pre zadanie
          setIsModalOpen(false); 

          // Nastavit úspešné odovzdanie a resetovať kód riešenia
          setSubmissionSuccess(true); 
          setSolutionCode(''); // Resetuje kód riešenia
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
    <div>
      {/* <h1>Ahoj, vitajte!</h1> */}
      
      {/* Zobrazenie chybovej správy, ak existuje */}
      {error && <p>{error}</p>}

      {/* Zobrazenie zoznamu zadania */}
      <Banner />
      <h2 className='zadaniaNazov'>Dostupné zadania:</h2>

      {/* <StudentCard
  firstName="Ján"
  lastName="Novák"
  studentClass="1SA"
  schoolYear="2024/2025"
/> */}

      
      {zadania.length === 0 ? (
        <p>Žiadne zadania na zobrazenie.</p>
      ) : (
        <div class="centered-container">
        <ul>
          {zadania.map((zadanie) => (
            <li key={zadanie.id}>
                <div className='nazov'> {zadanie.nazov}</div>
                <div className='popis'> {zadanie.popis}</div>
                <div className='stav'>
                Hodnotenie posledného odovzdania:
                <div className="stav" style={{ color: '#ff00f5' }}>
                    {zadanie.posledne_odovzdanie_stav
                        ? zadanie.posledne_odovzdanie_stav
                        : 'Zadanie ešte nebolo odovzdané'}
                    </div>
                </div>
              <button onClick={() => openModal(zadanie)}>
                ODOVZDAŤ 
                
              </button>
               {/* Zobrazenie popisu vedľa názvu */}
            </li>
          ))}
        </ul>
        </div>
      )}

      {/* Modálne okno na odovzdanie */}
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
              <button type="submit">Odovzdať</button>
            </form>
            <button onClick={closeModal}>Zavrieť</button>
          </div>
        </div>
      )}
       {/* Modálne okno pre úspešné odovzdanie */}
       {submissionSuccess && (
        <div className="modal" >
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
