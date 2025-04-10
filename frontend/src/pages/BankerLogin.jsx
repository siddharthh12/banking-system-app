import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BankerLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // ✅ Hardcoded login credentials
    if (username === 'banker' && password === 'admin123') {
      alert('Login Successful');
      localStorage.setItem('token', 'dummy-banker-token');
      navigate('/banker/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#121212',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#1e1e1e',
        padding: '30px',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 0 15px rgba(0,0,0,0.5)',
        color: '#fff'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>👨‍💼 Banker Login</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            required
            onChange={(e) => {
              setUsername(e.target.value);
              setError('');
            }}
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #333',
              backgroundColor: '#2a2a2a',
              color: '#fff'
            }}
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            required
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #333',
              backgroundColor: '#2a2a2a',
              color: '#fff'
            }}
          />
          <button type="submit" style={{
            padding: '12px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Login
          </button>
          {error && (
            <p style={{ color: 'red', textAlign: 'center', marginTop: '8px' }}>{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default BankerLogin;
