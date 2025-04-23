import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../screens/LoginPage.css'; // Import CSS súboru
import ProfilePage from '../screens/ProfilePage';
import { useParams, useNavigate } from 'react-router-dom';

const Banner = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  // Získaj meno prihláseného používateľa z localStorage (alebo z tokenu)
  const username = localStorage.getItem('username') || 'Neznámy používateľ'; 

  // Funkcia na odhlásenie
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/';  // Presmerovanie na prihlásenie
  };

  return (
    <>
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}
      
      <div className="banner">
        <div className="left">
          <button onClick={() => setMenuOpen(!menuOpen)} className="menuButton">
            ☰
          </button>
          {menuOpen && (
            <div className="menu">
              <Link to="/submission" className="menuItem">Domov</Link>
              <Link to="/profile" className="menuItem">Profil</Link>
              <Link to="/settings" className="menuItem">Nastavenia</Link>
            </div>
          )}
        </div>
  
        <div className="center">
          <h2 className='zadaniaNazov'>
            {username}
          </h2>
        </div>
  
        <div className="right">
          <button onClick={handleLogout} className="logoutButton">
            Odhlásiť sa
          </button>
        </div>
      </div>
    </>
  );
  
};

export default Banner;
