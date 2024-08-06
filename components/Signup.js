import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = ({ setIsAuthenticated, setErrorMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const url = 'https://json-storage-api.p.rapidapi.com/datalake';
  const headers = {
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': '68c18bd9e8msh5b5329b16d84ea3p1de8e7jsne487536a97c1',
    'X-RapidAPI-Host': 'json-storage-api.p.rapidapi.com'
  };

  const handleSignup = async () => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          '@context': [
            'http://schema4i.org/Thing.jsonld',
            'http://schema4i.org/DataLakeItem',
            'http://schema4i.org/UserAccount'
          ],
          '@type': 'DataLakeItem',
          '@id': email, // Using email as unique identifier
          Creator: {
            '@type': 'UserAccount',
            Name: name,
            Email: email,
            Password: password,
            Balance: 0, // Initialize balance to 0
            Transactions: []
          }
        })
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setErrorMessage('');
        navigate('/dashboard');
      } else {
        setIsAuthenticated(false);
        setErrorMessage('Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setErrorMessage('An error occurred during signup. Please try again.');
    }
  };

  return (
    <div className="signup-area container mt-5">
      <h1>Signup</h1>
      <div className="form-group">
        <input
          className="form-control"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <input
          className="form-control"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          className="form-control"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button className="btn btn-primary themebutton" onClick={handleSignup}>
          Signup
        </button>
        {setErrorMessage && <p style={{ color: 'red' }}>{setErrorMessage}</p>}
      </div>
    </div>
  );
};

export default Signup;
