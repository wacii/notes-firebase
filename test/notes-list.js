import React from 'react';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import NotesList from '../src/notes-list';

describe('NotesList', function() {
  it('shows error banner', function(done) {
    const promise = Promise.reject();
    const remove = (_id) => promise;
    const note = {
      text: 'A note!',
      id: 1,
    };
    const wrapper = mount(
      <NotesList notes={[note]} remove={remove} />
    );

    wrapper.find('NoteItem button').simulate('click');
    promise.catch(() => {
      expect(wrapper.html()).to.have.string('There was an error');
      done();
    })
  });

  it('closes error banner', function() {
    const noop = () => {};
    const notes = [{ text: 'A note!', id: 1 }];
    const wrapper = mount(
      <NotesList notes={notes} remove={noop} />
    );
    wrapper.setState({ error: true });

    expect(wrapper.find('LostDataBanner')).to.have.lengthOf(1);
    wrapper.find('LostDataBanner button').simulate('click');
    expect(wrapper.find('LostDataBanner')).to.have.lengthOf(0);
  });

  it('renders all notes', function() {
    const noop = () => {};
    const notes = [
      { text: 'A note!', id: 1 },
      { text: 'Another note!', id: 2 },
    ];
    const wrapper = mount(
      <NotesList notes={notes} remove={noop} />
    );

    expect(wrapper.html()).to.have.string('A note!');
    expect(wrapper.html()).to.have.string('Another note!');
  });
});
