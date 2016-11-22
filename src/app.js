import React from 'react';
import { BrowserRouter, Match, Miss, Redirect } from 'react-router';
import { Login, Signup} from './auth';
import { onAuthStateChanged } from './api'
import Main from './main';
import SyncFirebase from './sync-firebase';

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
          {loggedOn ? (
            <SyncFirebase>
              <Match pattern='/' component={Main} />
              <Miss render={() => <Redirect to='/' />} />
            </SyncFirebase>
          ) : (
            <div>
              <Match pattern='/login' component={Login} />
              <Match pattern='/signup' component={Signup} />
              <Miss render={() => <Redirect to='/login' />} />
            </div>
          )}
        </div>
      </BrowserRouter>
    );
  }
}
