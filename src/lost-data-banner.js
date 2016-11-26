import React from 'react';

export default function LostDataBanner({close}) {
  return (
    <div className="toast-danger">
      <span>There was an error saving your note</span>
      <button onClick={close}>X</button>
    </div>
  );
}
