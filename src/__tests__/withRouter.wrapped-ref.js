import React, { Component } from 'react';
import { mount } from 'enzyme';
import { withFirestore, FirestoreProvider } from '../';
import { createMocksForDocument } from './helpers/firestore-utils';

const createChild = () => {
  // eslint-disable-next-line react/prefer-stateless-function
  class Child extends Component {
    render() {
      return null;
    }
  }

  return Child;
};

test('passes wrappedComponentRef to wrapped component', () => {
  const { firebaseMock, firestoreMock } = createMocksForDocument();
  const otherProps = { testProp: 'test' };
  const Child = createChild();
  const ComponentWithFirestore = withFirestore(Child);
  let wrappedRef;

  const component = mount(
    <FirestoreProvider firebase={firebaseMock}>
      <ComponentWithFirestore
        {...otherProps}
        wrappedComponentRef={ref => {
          wrappedRef = ref;
        }}
      />
    </FirestoreProvider>,
  );

  const child = component.find(Child);

  expect(wrappedRef).toBe(child.instance());
  expect(child.props()).toEqual({ firestore: firestoreMock, ...otherProps });
});
