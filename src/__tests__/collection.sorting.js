import React from 'react';
import { mount } from 'enzyme';
import { FirestoreCollection, FirestoreProvider } from '../';
import { createMocksForCollection } from './helpers/firestore-utils';

test('sorts by a single field', () => {
  const {
    firebaseMock,
    collectionMock,
    query,
    onSnapshotMock,
  } = createMocksForCollection();
  const renderMock = jest.fn().mockReturnValue(<div />);
  const collectionName = 'users';
  const sortField = 'name';

  mount(
    <FirestoreProvider firebase={firebaseMock}>
      <FirestoreCollection
        path={collectionName}
        sort={sortField}
        render={renderMock}
      />
    </FirestoreProvider>,
  );

  expect(collectionMock).toHaveBeenCalledTimes(1);
  expect(collectionMock).toHaveBeenCalledWith(collectionName);
  expect(query.orderBy).toHaveBeenCalledTimes(1);
  expect(query.orderBy).toHaveBeenCalledWith('name', undefined);
  expect(onSnapshotMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith(
    expect.objectContaining({
      isLoading: true,
      data: [],
    }),
  );
});

test('sorts by a multiple fields', () => {
  const {
    firebaseMock,
    collectionMock,
    query,
    onSnapshotMock,
  } = createMocksForCollection();
  const renderMock = jest.fn().mockReturnValue(<div />);
  const collectionName = 'users';
  const sort = 'name,joinedDate:desc';

  mount(
    <FirestoreProvider firebase={firebaseMock}>
      <FirestoreCollection
        path={collectionName}
        sort={sort}
        render={renderMock}
      />
    </FirestoreProvider>,
  );

  expect(collectionMock).toHaveBeenCalledTimes(1);
  expect(collectionMock).toHaveBeenCalledWith(collectionName);
  expect(query.orderBy).toHaveBeenCalledTimes(2);
  expect(query.orderBy).toHaveBeenCalledWith('name', undefined);
  expect(query.orderBy).toHaveBeenCalledWith('joinedDate', 'desc');
  expect(onSnapshotMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith(
    expect.objectContaining({
      isLoading: true,
      data: [],
    }),
  );
});
