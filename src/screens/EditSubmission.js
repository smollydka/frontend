import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditSubmission() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [zadanie, setZadanie] = useState(null); // null namiesto {}

  const [newTest, setNewTest] = useState({
    prikaz1: '',
    prikaz2: '',
    pocet_parametrov: 0,
  });

  const formatDate = (date) => {
    return date ? date.substring(0, 10) : "";
  };

  useEffect(() => {
    const fetchZadanie = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:5000/zadanie/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setZadanie(data.zadanie);
        }
      } catch (err) {
        console.error('Chyba pri načítaní zadania:', err);
      }
    };

    fetchZadanie();
  }, [id]);

  // ✅ Zabránime chybe
  if (!zadanie) {
    return <div>Načítavam údaje...</div>;
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/zadania/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(zadanie),
      });

      const data = await response.json();

      if (data.success) {
        navigate(-1); // vráti späť
      } else {
        alert('Uloženie zlyhalo.');
      }
    } catch (err) {
      console.error('Chyba pri ukladaní:', err);
    }
  };

  const handleTestSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newTest,
          zadanie_id: id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Test bol úspešne pridaný.');
        setNewTest({ prikaz1: '', prikaz2: '', pocet_parametrov: 0 });
      } else {
        alert('Nepodarilo sa pridať test.');
      }
    } catch (err) {
      console.error('Chyba pri ukladaní testu:', err);
    }
  };

  return (
    <div>

    <header>SPŠE PO Programovanie 1.SA - Zadania triedy</header>
    <div className="form-wrapper">
   
    <div className="form-row">
      <form onSubmit={handleSubmit} className="zadanie-form" style={{width: '100%'}}>
        <h2>Upraviť zadanie</h2>

        <label>
          Názov:
          <input
            type="text"
            value={zadanie.nazov}
            onChange={(e) => setZadanie({ ...zadanie, nazov: e.target.value })}
            placeholder="Názov zadania"
            />
        </label>

        <label>
          Popis:
          <textarea
            value={zadanie.popis}
            onChange={(e) => setZadanie({ ...zadanie, popis: e.target.value })}
            placeholder="Popis zadania"
            />
        </label>

        <label>
          Dátum vytvorenia:
          <input
            type="date"
            value={formatDate(zadanie.datum_vytvorenia)}
            onChange={(e) =>
                setZadanie({ ...zadanie, datum_vytvorenia: e.target.value })
            }
            />
        </label>

        <label>
          Dátum uzavretia:
          <input
            type="date"
            value={formatDate(zadanie.datum_uzavretia)}
            onChange={(e) =>
                setZadanie({ ...zadanie, datum_uzavretia: e.target.value })
            }
            />
        </label>

        <label>
          Vzor:
          <textarea
            value={zadanie.vzor}
            onChange={(e) => setZadanie({ ...zadanie, vzor: e.target.value })}
            placeholder="Vzorový kód"
            />
        </label>

        <label>
          Testovacie dáta:
          <textarea
            value={zadanie.testovacie_data}
            onChange={(e) =>
                setZadanie({ ...zadanie, testovacie_data: e.target.value })
            }
            placeholder="Testovacie dáta"
            />
        </label>

        <label>
          Trieda ID:
          <input
            type="number"
            value={zadanie.trieda_id}
            onChange={(e) =>
                setZadanie({ ...zadanie, trieda_id: parseInt(e.target.value) })
            }
            placeholder="ID triedy"
            />
        </label>

        <button type="submit">Uložiť zmeny</button>
      </form>
   
    <div className="test-form">
        <h3>Pridať nový test</h3>
        <form onSubmit={handleTestSubmit}>
          <label>Príkaz 1:
            <input type="text" value={newTest.prikaz1} onChange={(e) => setNewTest({ ...newTest, prikaz1: e.target.value })} />
          </label>

          <label>Príkaz 2:
            <input type="text" value={newTest.prikaz2} onChange={(e) => setNewTest({ ...newTest, prikaz2: e.target.value })} />
          </label>

          <label>Počet parametrov:
            <input type="number" value={newTest.pocet_parametrov} onChange={(e) => setNewTest({ ...newTest, pocet_parametrov: parseInt(e.target.value) })} />
          </label>

          <button type="submit">Pridať test</button>
        </form>
      </div>
        
    </div>
            </div>
        
            </div>
  );
}

export default EditSubmission;
