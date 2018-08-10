import React from 'react';
import { mount } from 'enzyme';
import { FirestoreCollection } from '../';
import { createMocksForCollection } from './helpers/firestore-utils';

test('initial state set up correctly', () => {
  const {
    firestoreMock,
    collectionMock,
    onSnapshotMock,
  } = createMocksForCollection();
  const renderMock = jest.fn().mockReturnValue(<div />);
  const collectionName = 'users';

  mount(<FirestoreCollection path={collectionName} render={renderMock} />, {
    context: { firestoreDatabase: firestoreMock, firestoreCache: {} },
  });

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
    firestoreMock,
    collectionMock,
    onSnapshotMock,
  } = createMocksForCollection();
  const renderMock = jest.fn().mockReturnValue(<div />);
  const collectionName = 'users';

  mount(
    <FirestoreCollection path={collectionName}>
      {renderMock}
    </FirestoreCollection>,
    {
      context: { firestoreDatabase: firestoreMock, firestoreCache: {} },
    },
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
    firestoreMock,
    collectionMock,
    onSnapshotMock,
  } = createMocksForCollection();
  const collectionName = 'users';

  mount(<FirestoreCollection path={collectionName} />, {
    context: { firestoreDatabase: firestoreMock, firestoreCache: {} },
  });

  expect(collectionMock).toHaveBeenCalledTimes(1);
  expect(collectionMock).toHaveBeenCalledWith(collectionName);
  expect(onSnapshotMock).toHaveBeenCalledTimes(1);
});
