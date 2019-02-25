import React from 'react';
import { mount } from 'enzyme';
import { FirestoreCollection, FirestoreProvider } from '../';
import { createMocksForCollection } from './helpers/firestore-utils';

test('initial state set up correctly', () => {
  const {
    firebaseMock,
    collectionMock,
    onSnapshotMock,
  } = createMocksForCollection();
  const renderMock = jest.fn().mockReturnValue(<div />);
  const collectionName = 'users';

  mount(
    <FirestoreProvider firebase={firebaseMock}>
      <FirestoreCollection path={collectionName} render={renderMock} />
    </FirestoreProvider>,
  );

  expect(collectionMock).toHaveBeenCalledTimes(1);
  expect(collectionMock).toHaveBeenCalledWith(collectionName);
  expect(onSnapshotMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith(
    expect.objectContaining({
      isLoading: true,
      data: [],
    }),
  );
});

test('renders child prop', () => {
  const {
    firebaseMock,
    collectionMock,
    onSnapshotMock,
  } = createMocksForCollection();
  const renderMock = jest.fn().mockReturnValue(<div />);
  const collectionName = 'users';

  mount(
    <FirestoreProvider firebase={firebaseMock}>
      <FirestoreCollection path={collectionName}>
        {renderMock}
      </FirestoreCollection>
    </FirestoreProvider>,
  );

  expect(collectionMock).toHaveBeenCalledTimes(1);
  expect(collectionMock).toHaveBeenCalledWith(collectionName);
  expect(onSnapshotMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith(
    expect.objectContaining({
      isLoading: true,
      data: [],
    }),
  );
});

test('renders nothing if passed no render prop or children', () => {
  const {
    firebaseMock,
    collectionMock,
    onSnapshotMock,
  } = createMocksForCollection();
  const collectionName = 'users';

  mount(
    <FirestoreProvider firebase={firebaseMock}>
      <FirestoreCollection path={collectionName} />
    </FirestoreProvider>,
  );

  expect(collectionMock).toHaveBeenCalledTimes(1);
  expect(collectionMock).toHaveBeenCalledWith(collectionName);
  expect(onSnapshotMock).toHaveBeenCalledTimes(1);
});
