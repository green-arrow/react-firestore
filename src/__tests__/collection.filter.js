import React from 'react';
import { mount } from 'enzyme';
import { FirestoreCollection, FirestoreProvider } from '../';
import { createMocksForCollection } from './helpers/firestore-utils';

test('filters the documents returned with a simple filter', () => {
  const {
    firebaseMock,
    collectionMock,
    query,
    onSnapshotMock,
  } = createMocksForCollection();
  const renderMock = jest.fn().mockReturnValue(<div />);
  const collectionName = 'users';
  const filter = ['name', '==', 'Mike'];

  mount(
    <FirestoreProvider firebase={firebaseMock}>
      <FirestoreCollection
        path={collectionName}
        filter={filter}
        render={renderMock}
      />
    </FirestoreProvider>,
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
    firebaseMock,
    collectionMock,
    query,
    onSnapshotMock,
  } = createMocksForCollection();
  const renderMock = jest.fn().mockReturnValue(<div />);
  const collectionName = 'users';
  const filter = [['firstName', '==', 'Mike'], ['lastName', '==', 'Smith']];

  mount(
    <FirestoreProvider firebase={firebaseMock}>
      <FirestoreCollection
        path={collectionName}
        filter={filter}
        render={renderMock}
      />
    </FirestoreProvider>,
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

test('filter accepts objects and numbers', () => {
  const { firebaseMock, firestoreMock } = createMocksForCollection();
  const renderMock = jest.fn().mockReturnValue(<div />);
  const collectionName = 'users';
  mount(
    <FirestoreProvider firebase={firebaseMock}>
      <FirestoreCollection
        path={collectionName}
        filter={['number', '==', 5]}
        render={renderMock}
      />
    </FirestoreProvider>,
  );
  mount(
    <FirestoreProvider firebase={firebaseMock}>
      <FirestoreCollection
        path={collectionName}
        filter={['ref', '==', firestoreMock.doc('things/foobar')]}
        render={renderMock}
      />
    </FirestoreProvider>,
  );
});
