import React from 'react';
import { mount } from 'enzyme';
import { Firestore, FirestoreProvider } from '../';
import { createMocksForDocument } from './helpers/firestore-utils';

test('provides the firestore database in render function', () => {
  const { firebaseMock, firestoreMock } = createMocksForDocument();
  const renderMock = jest.fn().mockReturnValue(<div />);

  mount(
    <FirestoreProvider firebase={firebaseMock}>
      <Firestore render={renderMock} />
    </FirestoreProvider>,
  );

  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith({ firestore: firestoreMock });
});
