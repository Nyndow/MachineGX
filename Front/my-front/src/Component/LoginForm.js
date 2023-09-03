import React, { Component } from 'react';
import '../Styles/LoginForm.css';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      isLoggedIn: false,
      error: '', // Add an error state to handle errors
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    // You can add your login logic here
    const { username, password } = this.state;

    // Example: Check if username and password match
    if (username === 'exampleUser' && password === 'examplePassword') {
      this.setState({ isLoggedIn: true, error: '' });
    } else {
      this.setState({ error: 'Invalid username or password' });
    }
  };

  render() {
    const { username, password, isLoggedIn, error } = this.state;

    if (isLoggedIn) {
      return <div>You are logged in!</div>;
    }

    return (
      <div className="login-container">
        <h2 className="login-title">Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={this.handleInputChange}
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    );
  }
}

export default LoginForm;
