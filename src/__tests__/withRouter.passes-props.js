import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import { withFirestore } from '../';

test('passes all props down to wrapped component', () => {
  const firestore = {};
  const emptyContext = {};
  const propsToBePassed = { propA: 'test' };
  const mockFunctionalComponent = jest.fn().mockReturnValue(<div />);
  const Component = withFirestore(mockFunctionalComponent);

  mount(<Component {...propsToBePassed} />, {
    context: { firestoreDatabase: firestore },
    childContextTypes: { firestoreDatabase: PropTypes.object.isRequired },
  });

  expect(mockFunctionalComponent).toHaveBeenCalledTimes(1);
  expect(mockFunctionalComponent).toHaveBeenCalledWith(
    { firestore, ...propsToBePassed },
    emptyContext,
  );
});
