import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {urlConfig} from '../../config';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setMessage('');

    try {
      const response = await fetch(urlConfig.backendUrl + '/api/auth/login', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': localStorage.getItem('token') ? 'Bearer ' + localStorage.getItem('token') : ''
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setMessage('Login successful');
      navigate('/app');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="login-card p-4 border rounded">
            <h2 className="text-center mb-4 font-weight-bold">Login</h2>
            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" className="form-control" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" className="form-control" value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
            {message && <div className="alert alert-info">{message}</div>}
            <button type="button" className="btn btn-primary w-100" onClick={handleLogin}>Login</button>
            <p className="mt-4 text-center">New here? <a href="/app/register" className="text-primary">Register Here</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
