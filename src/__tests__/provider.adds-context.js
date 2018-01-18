import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import { FirestoreProvider } from '../';

const createChild = () => {
  // eslint-disable-next-line react/prefer-stateless-function
  class Child extends Component {
    render() {
      return null;
    }
  }

  Child.contextTypes = {
    firestoreDatabase: PropTypes.object.isRequired,
    firestoreCache: PropTypes.object.isRequired,
  };

  return Child;
};

test('database and cache are added to child context', () => {
  const Child = createChild();
  const firestore = {};
  const firebase = {
    firestore: jest.fn().mockReturnValueOnce(firestore),
  };

  const component = mount(
    <FirestoreProvider firebase={firebase}>
      <Child />
    </FirestoreProvider>
  );
  const child = component.find('Child');

  expect(child.instance().context.firestoreDatabase).toBe(firestore);
  expect(child.instance().context.firestoreCache).toBeDefined();
});
