import React from 'react';
import { mount } from 'enzyme';
import { FirestoreCollection } from '../';
import { createMocksForCollection } from './helpers/firestore-utils';

test('filters the documents returned with a simple filter', () => {
  const {
    firestoreMock,
    collectionMock,
    query,
    onSnapshotMock,
  } = createMocksForCollection();
  const renderMock = jest.fn().mockReturnValue(<div />);
  const collectionName = 'users';
  const filter = ['name', '==', 'Mike'];

  mount(
    <FirestoreCollection
      path={collectionName}
      filter={filter}
      render={renderMock}
    />,
    { context: { firestoreDatabase: firestoreMock, firestoreCache: {} } },
  );

  expect(collectionMock).toHaveBeenCalledTimes(1);
  expect(collectionMock).toHaveBeenCalledWith(collectionName);
  expect(query.where).toHaveBeenCalledTimes(1);
  expect(query.where).toHaveBeenCalledWith(...filter);
  expect(onSnapshotMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith(
    expect.objectContaining({
      isLoading: true,
      data: [],
    }),
  );
});

test('filters the documents returned with a compound filter', () => {
  const {
    firestoreMock,
    collectionMock,
    query,
    onSnapshotMock,
  } = createMocksForCollection();
  const renderMock = jest.fn().mockReturnValue(<div />);
  const collectionName = 'users';
  const filter = [['firstName', '==', 'Mike'], ['lastName', '==', 'Smith']];

  mount(
    <FirestoreCollection
      path={collectionName}
      filter={filter}
      render={renderMock}
    />,
    { context: { firestoreDatabase: firestoreMock, firestoreCache: {} } },
  );

  expect(collectionMock).toHaveBeenCalledTimes(1);
  expect(collectionMock).toHaveBeenCalledWith(collectionName);
  expect(query.where).toHaveBeenCalledTimes(2);
  expect(query.where).toHaveBeenCalledWith(...filter[0]);
  expect(query.where).toHaveBeenCalledWith(...filter[1]);
  expect(onSnapshotMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith(
    expect.objectContaining({
      isLoading: true,
      data: [],
    }),
  );
});
