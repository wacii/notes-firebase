import React from 'react';
import { Link } from 'react-router';
import LostDataBanner from './lost-data-banner';
import { liveNotes, deleteNote } from './api';

// FIXME: remove this and other <br>s in favor of css
function NoteItem({note, remove}) {
  return (
    <div>
      <div className="card">
        <div className="card-header">
          <button className="btn btn-clear float-right"
            onClick={() => remove(note.key)} />
        </div>
        <p className="card-body">{note.text}</p>
      </div>
      <br />
    </div>
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
        <div>{noteItems}</div>
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
