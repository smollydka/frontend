import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function SubmissionTests() {
  const { zadanieId, studentId } = useParams();
  const [odovzdania, setOdovzdania] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch(`https://backend-server-6zvl.onrender.com/odovzdania/${zadanieId}/${studentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOdovzdania(data.odovzdania);
        } else {
          setError('Chyba pri načítavaní odovzdaní.');
        }
      })
      .catch(err => {
        console.error(err);
        setError('Serverová chyba');
      })
      .finally(() => setLoading(false));
  }, [zadanieId, studentId]);

  const formatDate = (str) => {
    const d = new Date(str);
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="wrapper">
      <h2>Odovzdania pre zadanie č. {zadanieId}</h2>
      <button onClick={() => navigate(-1)}>⬅ Späť</button>

      {loading ? (
        <p>🔄 Načítavam...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : odovzdania.length === 0 ? (
        <p>Žiadne odovzdania nenájdené.</p>
      ) : (
        <ul>
          {odovzdania.map((o) => {
            let parsedStav = { score: 'N/A', total: 'N/A', percent: 'N/A' };
            try {
              parsedStav = typeof o.stav === 'string' ? JSON.parse(o.stav) : o.stav;
            } catch {
              // fallback zostáva
            }

            return (
              <li key={o.id} style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
                <div><strong>Dátum odovzdania:</strong> {formatDate(o.datum_odovzdania)}</div>
                <div><strong>Výsledok:</strong></div>
                <ul>
                  <li>✅ Testy prešli: {parsedStav.score}</li>
                  <li>📋 Počet testov: {parsedStav.total}</li>
                  <li>🏁 Skóre: {parsedStav.percent}%</li>
                </ul>
                <div><strong>Kód riešenia:</strong></div>
                <pre style={{ background: '#eee', padding: '10px' }}>{o.kod_riesenia}</pre>
                {o.poznamky && <div><strong>Poznámky:</strong> {o.poznamky}</div>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default SubmissionTests;
