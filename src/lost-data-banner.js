import React from 'react';

export default function LostDataBanner({close}) {
  return (
    <div className="alert error">
      <span>There was an error saving your note</span>
      <button onClick={close}>X</button>
    </div>
  );
}
