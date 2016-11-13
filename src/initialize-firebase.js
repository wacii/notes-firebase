import React from 'react';
import { init } from './api';

export default class InitializeFirebase extends React.Component {
  constructor(props) {
    super(props);
    this.state = { initialized: false };
  }

  componentDidMount() {
    init().then(() => this.setState({ initialized: true }));
  }

  render() {
    if (this.state.initialized)
      return <div>{this.props.children}</div>;

    return (
      <p>Connecting to firebase...</p>
    );
  }
}
