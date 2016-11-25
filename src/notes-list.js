import React from 'react';
import { Link } from 'react-router';
import LostDataBanner from './lost-data-banner';
import { liveNotes, deleteNote } from './api';

function NoteItem({note, remove}) {
  return (
    <li>
      <span>{note.text}</span>
      <button onClick={() => remove(note.key)}>X</button>
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

  remove(key) {
    deleteNote(key)
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
    this.updateNotes = notes => this.setState({ notes })
  }

  componentDidMount() {
    this.unsubscribe = liveNotes(this.updateNotes);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return <NotesList notes={this.state.notes} />
  }
}
