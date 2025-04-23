import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [id, setId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://backend-server-6zvl.onrender.com/login', {
        username,
        password,
        role,
        id,
      });

      if (response.data.success) {
        // Uloženie tokenu do LocalStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('id', response.data.id); // Uloženie roly
        console.log(response.data.role)
        // Presmerovanie podľa roly
        if (response.data.role === 'ucitel') {
          navigate('/teachersubmission');
        } else {
          navigate('/submission');
        }
      } else {
        setError('Nesprávne prihlasovacie údaje.');
      }
    } catch (err) {
      console.error('Chyba:', err);
      setError('Zadané prihlasovacie údaje nie sú správne.');
    }
  };


  return (
    <div className="wrapper">
      <header>Systém na správu stredoškolských programovacích zadaní </header>
      <div className="login-container-wrapper">
        <div className="login-container">
          <h2>Prihlásenie</h2>
          {error && <p style={{
            color: 'red', fontSize: '18px', textAlign: 'center'
          }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Meno:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Heslo:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Prihlásiť sa</button>
          </form>
        </div>
        <div className="image-container"></div>
      </div>
    </div>

  );
}

export default LoginPage;
