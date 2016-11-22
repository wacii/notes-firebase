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

  // FIXME: having Miss outside of SyncFirebase is necessary...
  //  but ruins the pattern, should be made into an HOC around Main/NotesList
  render() {
    const {loggedOn} = this.state;

    return (
      <BrowserRouter>
        <div>
          {loggedOn && <Logout />}
          <Match exactly pattern='/' render={() =>
            loggedOn ? (
              <SyncFirebase>
                <Main />
              </SyncFirebase>
            ) : (
              <Redirect to='/login' />
            )} />
          <Match pattern='/notes' render={() =>
            loggedOn ? (
              <SyncFirebase>
                <NotesList />
              </SyncFirebase>
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
