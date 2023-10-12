import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/LoginForm.css';

function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    error: '',
  });
  const apiUrl = process.env.REACT_APP_API_URL;
  const [token, setToken] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const { username, password } = formData;

    axios.post(`${apiUrl}/login`, {
      username,
      password,
    })
    .then(response => {
      const { token } = response.data;
      setToken(token);
      setFormData({ username: '', password: '', error: '' });
      localStorage.setItem('token', token);
    })
    .catch(error => {
      setFormData({ ...formData, error: 'Invalid username or password' });
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  if (token) {
    return (
      <div>
        <div>You are logged in!</div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      {formData.error && <div className="error-message">{formData.error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
