import React, { useState, useEffect } from 'react';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [incorrect, setIncorrect] = useState('');
  const navigate = useNavigate();
  const bearerToken = sessionStorage.getItem('bearer-token');
  const { setIsLoggedIn } = useAppContext();

  useEffect(() => {
    if (sessionStorage.getItem('auth-token')) {
      navigate('/app');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(urlConfig.backendUrl + '/api/auth/login', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: bearerToken ? 'Bearer ' + bearerToken : '',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.authtoken) {
        sessionStorage.setItem('auth-token', data.authtoken);
        sessionStorage.setItem('name', data.userName);
        sessionStorage.setItem('email', data.userEmail);
        setIsLoggedIn(true);
        navigate('/app');
      } else {
        setEmail('');
        setPassword('');
        setIncorrect('Wrong password. Try again.');
        setTimeout(() => setIncorrect(''), 2000);
      }
    } catch (error) {
      console.log('Error fetching details: ' + error.message);
      setIncorrect('Unable to log in. Please try again.');
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
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIncorrect('');
                }}
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setIncorrect('');
                }}
              />
              <span
                style={{
                  color: 'red',
                  height: '.5cm',
                  display: 'block',
                  fontStyle: 'italic',
                  fontSize: '12px',
                }}
              >
                {incorrect}
              </span>
            </div>
            <button className="btn btn-primary w-100" onClick={handleLogin}>
              Login
            </button>
            <p className="mt-4 text-center">
              New here?{' '}
              <a href="/app/register" className="text-primary">
                Register Here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
