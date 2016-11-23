import React from 'react';
import { Link } from 'react-router';
import { logout, login, signup } from './api';

// TODO: calculate validity once, in the model layer, or something

const emailRe = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

class EmailField extends React.Component {
  state = { dirty: false }

  isValid(email) {
    return emailRe.test(email);
  }

  render() {
    const { value, update } = this.props;

    return (
      <div>
        <label>
          <span>Email:</span>
          <input type="email" name="email"
            onBlur={() => this.setState({ dirty: true })}
            onChange={event => update(event.target.value)} />
          {this.state.dirty && !this.isValid(this.props.value) &&
            <p className="error">Not a valid email.</p>}
        </label>
      </div>
    );
  }
}

class PasswordField extends React.Component {
  state = { dirty: false }

  isValid(password) {
    return password.length >= 6
  }

  render() {
    const { value, update } = this.props;

    return (
      <div>
        <label>
          <span>Password:</span>
          <input type="password" name="password"
            onBlur={() => this.setState({ dirty: true })}
            onChange={event => update(event.target.value)} />
          {this.state.dirty && !this.isValid(value) &&
            <p className="error">Password should be at least six characters</p>}
        </label>
      </div>
    );
  }
}

class PasswordConfirmationField extends React.Component {
  state = { dirty: false }

  isValid(password, passwordConfirmation) {
    return password === passwordConfirmation;
  }

  render() {
    const { password, value, update } = this.props;

    return (
      <div>
        <label>
          <span>Password confirmation:</span>
          <input type="password" name="password-confirmation"
            onBlur={() => this.setState({ dirty: true })}
            onChange={event => update(event.target.value)} />
          {this.state.dirty && !this.isValid(password, value) &&
            <p className="error">Password do not match</p>}
        </label>
      </div>
    );
  }
}

export class Login extends React.Component {
  state = {
    loading: false,
    error: false,
    email: '',
    password: '',
  }

  submit(event) {
    const { email, password } = this.state;
    login(email, password)
      .catch(_error => this.setState({ loading: false, error: true }));
    this.setState({ loading: true });
    event.preventDefault();
  }

  isValid({ email, password }) {
    return emailRe.test(email) && password.length >= 6;
  }

  render() {
    const { email, password, loading, error } = this.state;

    return (
      <div>
        <form onSubmit={event => this.submit(event)}>
          <EmailField
            value={email}
            update={email => this.setState({ email })} />
          <PasswordField
            value={password}
            update={password => this.setState({ password })} />
          {error &&
            <p className="error">Email password combination not found</p>}
          <input type="submit" disabled={loading || !this.isValid(this.state)} />
        </form>
        <Link to="/signup">Register</Link>
      </div>
    );
  }
}

export class Signup extends React.Component {
  state = {
    loading: false,
    error: false,
    email: null,
    password: '',
    passwordConfirmation: '',
  }

  submit(event) {
    const { email, password } = this.state;
    signup(email, password)
      .catch(error => this.setState({ loading: false, error: error.message }));
    this.setState({ loading: true });
    event.preventDefault();
  }

  isValid({ email, password, passwordConfirmation }) {
    return emailRe.test(email) &&
      password.length >= 6 &&
      password === passwordConfirmation;
  }

  render() {
    const { loading, error } = this.state;
    const { email, password, passwordConfirmation } = this.state;

    return (
      <div>
        <form onSubmit={event => this.submit(event)}>
          <EmailField
            value={email}
            update={email => this.setState({ email })} />
          <PasswordField
            value={password}
            update={password => this.setState({ password })} />
          <PasswordConfirmationField
            password={password}
            value={passwordConfirmation}
            update={passwordConfirmation =>
              this.setState({ passwordConfirmation })} />
          {error &&
            <p className="error">{error}</p>}
          <input type="submit"
            disabled={loading || !this.isValid(this.state)} />
        </form>
        <Link to="/login">Login</Link>
      </div>
    );
  }
}

export class Logout extends React.Component {
  state = { loading: false, error: null }

  render() {
    return (
      <button onClick={event => {
        this.setState({ loading: true, error: null });
        logout().catch(error =>
          this.setState({ loading: false, error: error.message})
        );
      }}>
        Logout
      </button>
    )
  }
}
