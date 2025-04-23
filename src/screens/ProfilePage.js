import React from 'react';
import Banner from '../components/Banner';
import { useParams, useNavigate } from 'react-router-dom';


const ProfilePage = () => {
    const navigate = useNavigate();
    
  return (
    <div>
    <Banner />
    
    <div className="profile-wrapper">
      <h2 className="zadaniaNazov">Tvôj Profil</h2>

      <div className="profile-content">
        <div className="profile-card">
          <h3>Tvoje informácie</h3>
          <p><strong>Meno:</strong> Test</p>
          <p><strong>Email:</strong> test@example.com</p>
          <p><strong>Ročník:</strong> 1. ročník</p>
          <p><strong>Študijný odbor:</strong> Informatika</p>
        </div>

        <div className="password-form">
          <h3>Zmena hesla</h3>
          <form>
            <label>Staré heslo</label>
            <input type="password" placeholder="Zadaj staré heslo" />

            <label>Nové heslo</label>
            <input type="password" placeholder="Zadaj nové heslo" />

            <label>Potvrď nové heslo</label>
            <input type="password" placeholder="Znova zadaj nové heslo" />

            <button type="submit">Zmeniť heslo</button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProfilePage;
