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
      <div className="form-group">
        <label className="form-label" htmlFor="email">
          Email:
        </label>
        <input type="email" name="email" id="email"
          className="form-input"
          onBlur={() => this.setState({ dirty: true })}
          onChange={event => update(event.target.value)} />
        {this.state.dirty && !this.isValid(this.props.value) &&
          <p className="form-input-hint">Not a valid email.</p>}
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
      <div className="form-group">
        <label className="form-label" htmlFor="password">
          Password:
        </label>
        <input type="password" name="password" id="password"
          className="form-input"
          onBlur={() => this.setState({ dirty: true })}
          onChange={event => update(event.target.value)} />
        {this.state.dirty && !this.isValid(value) &&
          <p className="form-input-hint">
            Password should be at least six characters
          </p>}
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
      <div className="form-group">
        <label className="form-label" htmlFor="password-confirmation">
          Password confirmation:
        </label>
        <input type="password" name="password-confirmation"
          id="password-confirmation"
          className="form-input"
          onBlur={() => this.setState({ dirty: true })}
          onChange={event => update(event.target.value)} />
        {this.state.dirty && !this.isValid(password, value) &&
          <p className="error">Password do not match</p>}
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
            <p className="form-input-hint">Email password combination not found</p>}
          <div>
            <button className="btn"
              disabled={loading || !this.isValid(this.state)}>
              Login
            </button>
          </div>
        </form>
        <br />
        <Link to="/signup">Sign up</Link>
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
            <p className="form-input-hint">{error}</p>}
          <div>
            <button className="btn"
              disabled={loading || !this.isValid(this.state)}>
              Sign up
            </button>
          </div>
        </form>
        <br />
        <Link to="/login">Login</Link>
      </div>
    );
  }
}

export class Logout extends React.Component {
  state = { loading: false, error: null }

  render() {
    return (
      <div>
        <button className="btn float-right" onClick={event => {
          this.setState({ loading: true, error: null });
          logout().catch(error =>
            this.setState({ loading: false, error: error.message})
          );
        }}>
          Logout
        </button>
        <h1>Notes</h1>
      </div>
    )
  }
}
