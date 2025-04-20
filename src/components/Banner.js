import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../screens/LoginPage.css'; // Import CSS súboru

const Banner = () => {
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
    <div className="banner">
      <div className="left">
        <button onClick={() => setMenuOpen(!menuOpen)} className="menuButton">
          ☰      
        </button>
        {menuOpen && (
          <div className="menu">
            <Link to="/home" className="menuItem">Domov</Link>
            <Link to="/profile" className="menuItem">Profil</Link>
            <Link to="/settings" className="menuItem">Nastavenia</Link>
          </div>
        )}
      </div>

      <div className="center">
        {username}
      </div>

      <div className="right">
        <button onClick={handleLogout} className="logoutButton">
          Odhlásiť sa
        </button>
      </div>
    </div>
  );
};

export default Banner;
