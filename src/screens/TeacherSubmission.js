import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'


function TeacherSubmission() {
  const [triedy, setTriedy] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Získame zoznam tried s počtom zadaní
    const fetchTriedy = async () => {
      try {
        const response = await fetch('https://backend-server-6zvl.onrender.com/teachersubmission');
        const data = await response.json();
        
        if (data.success) {
          setTriedy(data.triedy);
        } else {
          console.error('Chyba pri získavaní tried');
        }
      } catch (error) {
        console.error('Chyba pri získavaní dát:', error);
      }
    };

    fetchTriedy();
  }, []);

  const handleGoToClass = (triedaId) => {
    // Presmerovanie na stránku so zadaním danej triedy
    navigate(`/teachersubmission/${triedaId}`);
  };

  return (
    <div>
      <header>SPŠE PO Programovanie 1.SA - Teacher's Submission</header>
      <div className="card-container">
        {triedy.map((trieda) => (
          <div className="card" key={trieda.id}>
            <h3>{trieda.nazov}</h3>
            <p>Počet zadaní: {trieda.pocet_zadani}</p>
            <button onClick={() => handleGoToClass(trieda.id)}>Vstúpiť do triedy</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeacherSubmission;
