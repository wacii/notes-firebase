import React from 'react';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import ReviewNote from '../src/review-note';

describe('ReviewNote', function() {
  it('shows error banner', function(done) {
    const noop = () => {};
    let promise;
    const fail = () => promise = Promise.reject();
    const wrapper = mount(
      <ReviewNote nextNote={noop} keepNote={fail} removeNote={noop} />
    );
    wrapper.setState({ note: 'A note!' });

    wrapper.find('#keep-note').simulate('click');
    promise.catch(() => {
      const bannerHTML = wrapper.find('.error.alert').html();
      expect(bannerHTML).to.have.string('There was an error');
      done();
    });
  });

  it('closes error banner', function() {
    const noop = () => {};
    const wrapper = mount(
      <ReviewNote nextNote={noop} keepNote={noop} removeNote={noop} />
    );
    wrapper.setState({ error: true });

    expect(wrapper.find('.error.alert').length).to.not.eql(0);
    wrapper.find('.error.alert button').simulate('click');
    expect(wrapper.find('.error.alert').length).to.eql(0);
  });

  it('displays note', function() {
    const noop = () => {};
    const nextNote = () => 'A note!';
    const wrapper = mount(
      <ReviewNote nextNote={nextNote} keepNote={noop} removeNote={noop} />
    );
    expect(wrapper.html()).to.have.string('A note!');
  });

  it('displays next note', function(done) {
    const noop = () => {};
    const nextNote = () => 'A note!';
    const promise = Promise.resolve();
    const resolve = () => promise;
    const wrapper = mount(
      <ReviewNote nextNote={noop} keepNote={resolve} removeNote={noop} />
    );
    wrapper.setState({ note: 'Another note...' });
    wrapper.setProps({ nextNote });

    wrapper.find('#keep-note').simulate('click');
    promise.then(() => {
      expect(wrapper.html()).to.have.string('A note!');
      done();
    });
  });

  it('shows empty screen when no note', function() {
    const noop = () => {};
    const wrapper = mount(
      <ReviewNote nextNote={noop} keepNote={noop} removeNote={noop} />
    );
    expect(wrapper.html()).to.have.string('There are no notes left');
  });
});
