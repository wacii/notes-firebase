import React from 'react';
import {notesStable} from './api';

const WAIT_FOR_STABLE_DATA = 50;

export default class SyncFirebase extends React.Component {
  constructor(props) {
    super(props);
    this.state = { synced: false };
  }

  componentDidMount() {
    notesStable().then(_notes => this.setState({ synced: true }));
  }

  render() {
    if (this.state.synced)
      return <this.props.component />

    return <p>Syncing...</p>;
  }
}
