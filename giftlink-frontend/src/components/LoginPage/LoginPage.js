import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Logging in user:', { email, password });
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
            <button type="button" className="btn btn-primary w-100" onClick={handleLogin}>Login</button>
            <p className="mt-4 text-center">New here? <a href="/app/register" className="text-primary">Register Here</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
