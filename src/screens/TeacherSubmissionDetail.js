import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function TeacherSubmissionDetail() {
  const { triedaId } = useParams();
  const [zadania, setZadania] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchZadania = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`https://backend-server-6zvl.onrender.com/zadania/${triedaId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setZadania(data.zadania); // predpokladáme, že data.zadania je pole
        } else {
          setError('Táto trieda zatiaľ nemá žiadne zadania.');
        }
      } catch (error) {
        setError('Chyba servera');
      }
    };

    fetchZadania();
  }, [triedaId]);

  return (
    <div>
      <header>SPŠE PO Programovanie 1.SA - Zadania triedy</header>
      <div className="centered-container">
        {error && <p>{error}</p>}
        <ul style={{width: '100%'}}>
          {zadania.map((zadanie) => (
            <li key={zadanie.id}>
              <h3 className="nazov">{zadanie.nazov}</h3>
              <p className="popis">{zadanie.popis}</p>
              <Link to={`/editzadanie/${zadanie.id}`}>
                <button>Upraviť</button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TeacherSubmissionDetail;
