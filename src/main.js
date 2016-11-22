import React from 'react';
import { Link } from 'react-router';
import NewNote from './new-note';
import ReviewNote from './review-note';
import { createNote, nextNote, keepNote, deleteNote } from './api'

export default function Main() {
  return (
    <div>
      <NewNote handler={createNote} />
      <ReviewNote
        nextNote={nextNote}
        keepNote={keepNote}
        removeNote={deleteNote} />
      <Link to="/notes">All notes</Link>
    </div>
  );
}
