import React from 'react';
import { BrowserRouter, Match, Miss, Redirect } from 'react-router';
import { Logout, Login, Signup} from './auth';
import { onAuthStateChanged } from './api'
import Main from './main';
import NotesList from './notes-list';
import SyncFirebase from './sync-firebase';

function NotFound() {
  return (
    <p>404: Not Found</p>
  );
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loggedOn: false };
  }

  componentDidMount() {
    onAuthStateChanged(user =>
      this.setState({ loggedOn: !!user })
    );
  }

  render() {
    const {loggedOn} = this.state;

    return (
      <BrowserRouter>
        <div>
          {loggedOn && <Logout />}
          <Match exactly pattern='/' render={() =>
            loggedOn ? (
              <SyncFirebase component={Main} />
            ) : (
              <Redirect to='/login' />
            )} />
          <Match pattern='/notes' render={() =>
            loggedOn ? (
              <SyncFirebase component={NotesList} />
            ) : (
              <Redirect to="/login" />
            )} />
          <Match pattern='/login' render={() =>
            loggedOn ? (
              <Redirect to='/' />
            ) : (
              <Login />
            )} />
          <Match pattern='/signup' render={() =>
            loggedOn ? (
              <Redirect to='/' />
            ) : (
              <Signup />
            )} />
          <Miss component={NotFound} />
        </div>
      </BrowserRouter>
    );
  }
}
