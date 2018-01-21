import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import { withFirestore } from '../';

test('injects component with firestore database', () => {
  const firestore = {};
  const emptyContext = {};
  const mockFunctionalComponent = jest.fn().mockReturnValue(<div />);
  const Component = withFirestore(mockFunctionalComponent);

  mount(<Component />, {
    context: { firestoreDatabase: firestore },
    childContextTypes: { firestoreDatabase: PropTypes.object.isRequired },
  });

  expect(mockFunctionalComponent).toHaveBeenCalledTimes(1);
  expect(mockFunctionalComponent).toHaveBeenCalledWith(
    { firestore },
    emptyContext,
  );
});
