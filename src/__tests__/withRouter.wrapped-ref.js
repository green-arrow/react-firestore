import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import { withFirestore } from '../';

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
  const firestore = {};
  const otherProps = { testProp: 'test' };
  const Child = createChild();
  const ComponentWithFirestore = withFirestore(Child);
  let wrappedRef;

  const component = mount(
    <ComponentWithFirestore
      {...otherProps}
      wrappedComponentRef={ref => {
        wrappedRef = ref;
      }}
    />,
    {
      context: { firestoreDatabase: firestore },
      childContextTypes: { firestoreDatabase: PropTypes.object.isRequired },
    },
  );

  const child = component.find(Child);

  expect(wrappedRef).toBe(child.instance());
  expect(child.props()).toEqual({ firestore, ...otherProps });
});
