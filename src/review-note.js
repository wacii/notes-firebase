import React from 'react';
import LostDataBanner from './lost-data-banner';

const LOADING = 'loading';
const ENTERING = 'entering';
const SHOWING = 'showing';
const REMOVING = 'removing';
const KEEPING = 'keeping';

const stateToComponent = {
  [LOADING]: LoadingNote,
  [ENTERING]: EnteringNote,
  [SHOWING]: ShowingNote,
  [REMOVING]: RemovingNote,
  [KEEPING]: KeepingNote,
};

function LoadingNote() {
  return (
    <div className="loading" />
  );
}

function EnteringNote({note}) {
  return (
    <div>
      <p>{note}</p>
      <div>
        <button className="btn" disabled>Keep</button>
        <button className="btn" disabled>Remove</button>
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
    <div className="empty">
      <p className="empty-title">There are no notes left to review.</p>
    </div>
  );
}

function ResolveNote({note, keep, remove}) {
  return (
    <div>
      <p>{note.text}</p>
      <div>
        <button id="keep-note" className="btn" onClick={keep}>
          Keep
        </button>
        <button id="remove-note" className="btn" onClick={remove}>
          Remove
        </button>
      </div>
    </div>
  )
}

function KeepingNote({note}) {
  return (
    <div>
      <p>{note}</p>
      <div>
        <button className="btn" disabled>Keep</button>
        <button className="btn" disabled>Remove</button>
      </div>
    </div>
  )
}

function RemovingNote({note}) {
  return (
    <div>
      <p>{note}</p>
      <div>
        <button className="btn" disabled>Keep</button>
        <button className="btn" disabled>Remove</button>
      </div>
    </div>
  )
}

export default class ReviewNote extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      note: '',
      state: LOADING,
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
    this.props.nextNote()
      .then(note => this.setState({ note, state: SHOWING }));
  }

  keep() {
    this.setState({ state: KEEPING });
    this.props.keepNote(this.state.note)
      .catch(_error => this.setState({ error: true }));
    this.nextNote();
  }

  remove() {
    this.setState({ state: REMOVING });
    this.props.removeNote(this.state.note)
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
      <div className="card">
        {error &&
          <LostDataBanner close={this.closeAlert}/>}

        <div className="card-body">
          <Note
            note={note}
            keep={this.keep}
            remove={this.remove} />
        </div>
      </div>
    );
  }
}
