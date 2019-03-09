import React from 'react';
import { mount } from 'enzyme';
import { withFirestore, FirestoreProvider } from '../';
import { createMocksForDocument } from './helpers/firestore-utils';

test('passes all props down to wrapped component', () => {
  const { firebaseMock, firestoreMock } = createMocksForDocument();
  const propsToBePassed = { propA: 'test' };
  const mockFunctionalComponent = jest.fn().mockReturnValue(<div />);
  const Component = withFirestore(mockFunctionalComponent);

  mount(
    <FirestoreProvider firebase={firebaseMock}>
      <Component {...propsToBePassed} />
    </FirestoreProvider>,
  );

  expect(mockFunctionalComponent).toHaveBeenCalledTimes(1);
  expect(mockFunctionalComponent).toHaveBeenCalledWith(
    { firestore: firestoreMock, ...propsToBePassed },
    {},
  );
});
