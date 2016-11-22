import React from 'react';
import { Link } from 'react-router';
import LostDataBanner from './lost-data-banner';
import { allNotes } from './api';

function NoteItem({note, remove}) {
  return (
    <li>
      <span>{note.text}</span>
      <button onClick={() => remove(note.id)}>X</button>
    </li>
  );
}

class NotesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
    this.remove = this.remove.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
  }

  remove(id) {
    this.props.remove(id)
      .catch(_error => this.setState({ error: true }));
  }

  closeAlert() {
    this.setState({ error: false });
  }

  render() {
    const noteItems = this.props.notes.map(note =>
      <NoteItem key={note.key} note={note} remove={this.remove} />
    );

    return (
      <div>
        {this.state.error &&
          <LostDataBanner close={this.closeAlert} />}
        <ul>{noteItems}</ul>
        <Link to="/">Back</Link>
      </div>
    );
  }
}

export default class NotesListContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { notes: [] };
  }

  componentDidMount() {
    this.setState({ notes: allNotes() });
  }

  render() {
    return <NotesList notes={this.state.notes} />
  }
}
