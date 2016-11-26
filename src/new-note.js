import React from 'react';
import LostDataBanner from './lost-data-banner';

export default class NewNote extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      error: false,
    };

    this.submit = this.submit.bind(this);
    this.updateText = this.updateText.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
  }

  submit(event) {
    event.preventDefault();
    this.props.handler(this.state.text)
      .catch(_error =>
        this.setState({ error: true })
      );
    this.setState({ text: '' });
  }

  updateText(event) {
    this.setState({ text: event.target.value });
  }

  closeAlert() {
    this.setState({ error: false });
  }

  render() {
    return (
      <div className="container">
        {this.state.error &&
          <LostDataBanner close={this.closeAlert} />}

        <form onSubmit={this.submit}>
          <div className="form-group">
            <textarea
              className="form-input"
              placeholder="New Note"
              onChange={this.updateText}
              value={this.state.text} />
          </div>
          <div>
            <button className="btn" disabled={this.state.text === ''}>
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}
