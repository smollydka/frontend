import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Banner from '../components/Banner';

function SubmissionTests() {
    const { zadanieId, studentId } = useParams();
    const [odovzdania, setOdovzdania] = useState([]);

    const [zadanieNazov, setZadanieNazov] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedNotes, setExpandedNotes] = useState(null);
    const navigate = useNavigate();


    const [statistics, setStatistics] = useState({
        averageScore: 0,
        totalAttempts: 0,
        bestScore: 0
    });

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
                    if (data.odovzdania.length > 0) {
                        setZadanieNazov(data.odovzdania[0].nazov_zadania);

                        // Vypočítame štatistiky
                        let totalScore = 0;
                        let attempts = 0;
                        let bestScore = 0;

                        data.odovzdania.forEach(o => {
                            let parsedStav = { score: 0, total: 0, percent: 0 };
                            try {
                                parsedStav = typeof o.stav === 'string' ? JSON.parse(o.stav) : o.stav;
                            } catch { }

                            // Skontroluj, či je percent platné číslo, ak nie, nastav na 0
                            let score = 0;
                            if (parsedStav && parsedStav.percent) {
                                if (typeof parsedStav.percent === 'string') {
                                    // Ak je percent reťazec (napr. "100.00%"), odstránime '%' a prevedieme na číslo
                                    score = parseFloat(parsedStav.percent.replace('%', '').trim()) || 0;
                                } else if (typeof parsedStav.percent === 'number') {
                                    // Ak je percent už číslo, jednoducho ho použijeme
                                    score = parsedStav.percent;
                                }
                            }
                            attempts += 1;
                            totalScore += score;
                            bestScore = Math.max(bestScore, score);
                        });

                        setStatistics({
                            averageScore: attempts > 0 ? totalScore / attempts : 0,
                            totalAttempts: attempts,
                            bestScore: bestScore
                        });
                    }
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

    const toggleNotes = (id) => {
        setExpandedNotes(prev => (prev === id ? null : id));
    };

    return (
        <div>
            <div className='report' style={{
                position: 'fixed',
                top: 290,
                left: '5%',
                width: '400px',
                height: '400px',

                padding: '20px',
                zIndex: 1000
            }}>
                <h3>{zadanieNazov}</h3>
                <p>Takto sa ti pri tomto zadaní darilo: </p>

                <div>
                    <h4>Štatistika:</h4>
                    <ul>
                        <li>🔢 Priemerné skóre: {statistics.averageScore.toFixed(2)}%</li>
                        <li>🎯 Počet pokusov: {statistics.totalAttempts}</li>
                        <li>🏅 Najlepšie skóre: {statistics.bestScore}%</li>
                    </ul>
                </div>
            </div>

            <Banner />
            <div className="wrapper" style={{ marginTop: '120px' }} >
                <h2 className='zadaniaNazov' >Odovzdania pre zadanie: <br></br>  {zadanieNazov} </h2>
                <button style={{ width: '30%', marginLeft: '35%' }} onClick={() => navigate(-1)}>⬅ Späť</button>

                {loading ? (
                    <p style={{ color: 'white' }}>🔄 Načítavam...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : odovzdania.length === 0 ? (
                    <p style={{ color: 'white' }}>Zadanie ešte nebolo odovzdané.</p>
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
                                <li key={o.id} style={{ borderBottom: '1px solid #ccc', marginBottom: '10px', width: '170%' }}>
                                    <div><strong>Dátum odovzdania:</strong> {formatDate(o.datum_odovzdania)}</div>
                                    <div><strong>Výsledok:</strong></div>
                                    <ul>
                                        <li>✅ Testy prešli: {parsedStav.score}</li>
                                        <li>📋 Počet testov: {parsedStav.total}</li>
                                        <li>🏁 Skóre: {parsedStav.percent}</li>
                                    </ul>
                                    <div><strong>Kód riešenia:</strong></div>
                                    <pre style={{ background: '#eee', padding: '10px' }}>{o.kod_riesenia}</pre>

                                    {o.poznamky && (
                                        <div>
                                            <button onClick={() => toggleNotes(o.id)} style={{ marginTop: '10px' }}>
                                                {expandedNotes === o.id ? '🔽 Výsledky testov' : '🔼 Výsledky testov'}
                                            </button>
                                            <div style={{ marginTop: '10px' }}>

                                                <strong >Odpoveď zo servera:</strong><br />
                                            </div>
                                            {expandedNotes === o.id && (

                                                <div style={{ marginTop: '8px', background: '#f0f0f0', padding: '10px' }}>
                                                    <pre style={{ whiteSpace: 'pre-wrap', marginTop: '5px' }}>{o.poznamky}</pre>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default SubmissionTests;
