import React from 'react';
import { mount } from 'enzyme';
import { FirestoreCollection, FirestoreProvider } from '../';
import { createMocksForCollection } from './helpers/firestore-utils';

test('limits the number of documents returned', () => {
  const {
    firebaseMock,
    collectionMock,
    query,
    onSnapshotMock,
  } = createMocksForCollection();
  const renderMock = jest.fn().mockReturnValue(<div />);
  const collectionName = 'users';
  const limit = 10;

  mount(
    <FirestoreProvider firebase={firebaseMock}>
      <FirestoreCollection
        path={collectionName}
        limit={limit}
        render={renderMock}
      />
    </FirestoreProvider>,
  );

  expect(collectionMock).toHaveBeenCalledTimes(1);
  expect(collectionMock).toHaveBeenCalledWith(collectionName);
  expect(query.limit).toHaveBeenCalledTimes(1);
  expect(query.limit).toHaveBeenCalledWith(limit);
  expect(onSnapshotMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith(
    expect.objectContaining({
      isLoading: true,
      data: [],
    }),
  );
});
