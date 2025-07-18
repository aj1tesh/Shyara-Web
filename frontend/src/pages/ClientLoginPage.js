import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Eye, EyeOff, Loader2, LogIn } from 'lucide-react';

const ClientLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/client-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('client_jwt', data.token);
      setLoading(false);
      navigate('/client-dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo-bg">
          <User className="login-logo-icon" />
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <h2 className="login-title"><User className="login-title-icon" /> Client Login</h2>
          <div className="login-field">
            <input
              type="email"
              placeholder="Email"
              className="login-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="login-field login-password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="login-eye-btn"
              tabIndex={-1}
              onClick={() => setShowPassword(v => !v)}
            >
              {showPassword ? <EyeOff className="login-eye-icon" /> : <Eye className="login-eye-icon" />}
            </button>
          </div>
          <div className="login-remember">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              className="login-checkbox"
            />
            <label htmlFor="remember" className="login-remember-label">Remember me</label>
          </div>
          {error && <div className="login-error">{error}</div>}
          <button
            className="login-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? <Loader2 className="login-btn-icon login-spin" /> : <LogIn className="login-btn-icon" />} Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientLoginPage; 