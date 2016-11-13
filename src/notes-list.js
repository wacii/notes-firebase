import React from 'react';
import LostDataBanner from './lost-data-banner';

function NoteItem({note, remove}) {
  return (
    <li>
      <span>{note.text}</span>
      <button onClick={() => remove(note.id)}>X</button>
    </li>
  );
}

export default class NotesList extends React.Component {
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
      <NoteItem key={note.id} note={note} remove={this.remove} />
    );

    return (
      <div>
        {this.state.error &&
          <LostDataBanner close={this.closeAlert} />}
        <ul>{noteItems}</ul>
      </div>
    );
  }
}
