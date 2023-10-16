import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; 
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
  const history = useHistory();

  
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
      history.push('/home');
    })
    .catch(error => {
      setFormData({ ...formData, error: 'Invalid username or password' });
    });
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  if(token)
  {
    history.push('/home');
  }

  return (
    <div className="crud-form-container">
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
