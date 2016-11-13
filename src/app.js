import React from 'react';
import { BrowserRouter, Match, Miss, Redirect } from 'react-router';
import { Login, Signup} from './auth';
import { onAuthStateChanged } from './api'
const Main = () => (<p>Main</p>);

function MatchUnlessLoggedOn({ component: Component, loggedOn, ...rest }) {
  return (
    <Match {...rest} render={props => (
      loggedOn ? (
        <Redirect to='/main' />
      ) : (
        <Component />
      )
    )} />
  );
}

function MatchIfLoggedOn({ component: Component, loggedOn, ...rest }) {
  return (
    <Match {...rest} render={props => (
      loggedOn ? (
        <Component />
      ) : (
        <Redirect to='/login' />
      )
    )} />
  )
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
        <MatchUnlessLoggedOn
          pattern='/login'
          component={Login}
          loggedOn={loggedOn} />
        <MatchUnlessLoggedOn
          pattern='/signup'
          component={Signup}
          loggedOn={loggedOn} />
        <MatchIfLoggedOn
          pattern='/main'
          component={Main}
          loggedOn={loggedOn} />
        <Miss render={() => (<p>Not Found!</p>)} />
        </div>
      </BrowserRouter>
    );
  }
}
