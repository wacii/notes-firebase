import React from 'react';
import LostDataBanner from './lost-data-banner';

const ENTERING = 'entering';
const SHOWING = 'showing';
const REMOVING = 'removing';
const KEEPING = 'keeping';

const stateToComponent = {
  [ENTERING]: EnteringNote,
  [SHOWING]: ShowingNote,
  [REMOVING]: RemovingNote,
  [KEEPING]: KeepingNote,
};

function EnteringNote({note}) {
  return (
    <div>
      <p>{note}</p>
      <div>
        <button disabled>Keep</button>
        <button disabled>Remove</button>
      </div>
    </div>
  )
}

function ShowingNote(props) {
  if (!props.note)
    return <EmptyNote />;
  return (<ResolveNote {...props} />);
}

function EmptyNote() {
  return (
    <p>There are no notes left to review.</p>
  );
}

function ResolveNote({note, keep, remove}) {
  return (
    <div>
      <p>{note.text}</p>
      <div>
        <button id="keep-note" onClick={keep}>Keep</button>
        <button id="remove-note" onClick={remove}>Remove</button>
      </div>
    </div>
  )
}

function KeepingNote({note}) {
  return (
    <div>
      <p>{note}</p>
      <div>
        <button disabled>Keep</button>
        <button disabled>Remove</button>
      </div>
    </div>
  )
}

function RemovingNote({note}) {
  return (
    <div>
      <p>{note}</p>
      <div>
        <button disabled>Keep</button>
        <button disabled>Remove</button>
      </div>
    </div>
  )
}

export default class ReviewNote extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      note: '',
      state: SHOWING,
      error: false,
    };

    this.nextNote = this.nextNote.bind(this);
    this.keep = this.keep.bind(this);
    this.remove = this.remove.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
  }

  componentDidMount() {
    this.nextNote();
  }

  nextNote() {
    this.setState({ note: this.props.nextNote(), state: SHOWING });
  }

  keep() {
    this.setState({ state: KEEPING });
    this.props.keepNote()
      .catch(_error => this.setState({ error: true }));
    this.nextNote();
  }

  remove() {
    this.setState({ state: REMOVING });
    this.props.removeNote()
      .catch(_error => this.setState({ error: true }));
    this.nextNote();
  }

  closeAlert() {
    this.setState({ error: false });
  }

  render() {
    const { note, state, error } = this.state;
    const Note = stateToComponent[state];

    return (
      <div>
        {error &&
          <LostDataBanner close={this.closeAlert}/>}

        <div>
          <Note
            note={note}
            keep={this.keep}
            remove={this.remove} />
        </div>
      </div>
    );
  }
}
