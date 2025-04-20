import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Odstránime token alebo iné údaje, ktoré sú potrebné pre odhlásenie
    localStorage.removeItem('token'); // Alebo použite sessionStorage, záleží na tom, čo používate
    // Môžete pridať ďalšie kroky, ak je potrebné zmazať aj iné údaje

    // Presmerovanie na úvodnú stránku (prihlásenie)
    navigate('/');
  };

  return (
    <button onClick={handleLogout}>Odhlásiť sa</button>
  );
};

export default LogoutButton;
