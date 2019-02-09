import React from 'react';
import { mount } from 'enzyme';
import { withFirestore, FirestoreProvider } from '../';
import { createMocksForDocument } from './helpers/firestore-utils';

test('injects component with firestore database', () => {
  const { firebaseMock, firestoreMock } = createMocksForDocument();
  const mockFunctionalComponent = jest.fn().mockReturnValue(<div />);
  const Component = withFirestore(mockFunctionalComponent);

  mount(
    <FirestoreProvider firebase={firebaseMock}>
      <Component />
    </FirestoreProvider>,
  );

  expect(mockFunctionalComponent).toHaveBeenCalledTimes(1);
  expect(mockFunctionalComponent).toHaveBeenCalledWith(
    { firestore: firestoreMock },
    {},
  );
});
