import React from 'react';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import NewNote from '../src/new-note';

describe('NewNote', function() {
  it('renders form', function() {
    const wrapper = shallow(<NewNote handler={() => new Promise}/>);
    expect(wrapper.find('textarea')).to.not.be.empty;
    expect(wrapper.find('input[type="submit"]')).to.not.be.empty;
  });

  it('shows error banner', function(done) {
    const promise = Promise.reject();
    const wrapper = shallow(<NewNote handler={() => promise}/>);

    wrapper.setState({ text: 'A note!' });
    wrapper.find('form').simulate('submit', { preventDefault: () => {}});

    promise.catch(() => {
      expect(wrapper.html()).to.have.string('There was an error');
      done();
    })
  });

  it('closes error banner', function() {
    const wrapper = mount(<NewNote handler={() => {}}/>);
    wrapper.setState({ error: true });

    expect(wrapper.html()).to.have.string('There was an error');
    wrapper.find('.error.alert').children('button').simulate('click');
    expect(wrapper.html()).to.not.have.string('There was an error');
  });
});
