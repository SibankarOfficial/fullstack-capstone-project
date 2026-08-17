import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {urlConfig} from '../../config';
import './RegisterPage.css';

function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    setMessage('');

    try {
      const response = await fetch(urlConfig.backendUrl + '/api/auth/register', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ firstName, lastName, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setMessage('Registration successful. Redirecting to login...');
      navigate('/app/login');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="register-card p-4 border rounded">
            <h2 className="text-center mb-4 font-weight-bold">Register</h2>
            <div className="form-group mb-3">
              <label htmlFor="firstName">First Name</label>
              <input id="firstName" type="text" className="form-control" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="lastName">Last Name</label>
              <input id="lastName" type="text" className="form-control" value={lastName} onChange={(event) => setLastName(event.target.value)} />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" className="form-control" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" className="form-control" value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
            {message && <div className="alert alert-info">{message}</div>}
            <button type="button" className="btn btn-primary w-100" onClick={handleRegister}>Register</button>
            <p className="mt-4 text-center">Already a member? <a href="/app/login" className="text-primary">Login</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
