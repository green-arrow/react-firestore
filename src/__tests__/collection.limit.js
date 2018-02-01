import React from 'react';
import { mount } from 'enzyme';
import { FirestoreCollection } from '../';
import { createMocksForCollection } from './helpers/firestore-utils';

test('limits the number of documents returned', () => {
  const {
    firestoreMock,
    collectionMock,
    query,
    onSnapshotMock,
  } = createMocksForCollection();
  const renderMock = jest.fn().mockReturnValue(<div />);
  const collectionName = 'users';
  const limit = 10;

  mount(
    <FirestoreCollection
      path={collectionName}
      limit={limit}
      render={renderMock}
    />,
    { context: { firestoreDatabase: firestoreMock, firestoreCache: {} } },
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
