import React from 'react';
import { mount } from 'enzyme';
import { FirestoreCollection } from '../';
import { createMocksForCollection } from './helpers/firestore-utils';

test('integrates with firestore using onSnapshot', () => {
  const documents = [
    {
      id: 1,
      name: 'John Smith',
    },
    {
      id: 2,
      name: 'Jane Doe',
    },
  ];
  const {
    firestoreMock,
    collectionMock,
    snapshot,
    onSnapshotMock,
  } = createMocksForCollection(documents);
  const renderMock = jest.fn().mockReturnValue(<div />);
  const collectionName = 'users';

  mount(<FirestoreCollection path={collectionName} render={renderMock} />, {
    context: { firestoreDatabase: firestoreMock, firestoreCache: {} },
  });

  expect(collectionMock).toHaveBeenCalledTimes(1);
  expect(collectionMock).toHaveBeenCalledWith(collectionName);
  expect(onSnapshotMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledTimes(2);
  expect(renderMock).toHaveBeenCalledWith(
    expect.objectContaining({
      isLoading: true,
      snapshot: null,
      data: [],
    })
  );
  expect(renderMock).toHaveBeenCalledWith(
    expect.objectContaining({
      isLoading: false,
      snapshot,
      data: documents,
    })
  );
});

test('does not re-render if no snapshot is returned', () => {
  const { firestoreMock, onSnapshotMock } = createMocksForCollection();
  const renderMock = jest.fn().mockReturnValue(<div />);

  mount(<FirestoreCollection path="users" render={renderMock} />, {
    context: { firestoreDatabase: firestoreMock, firestoreCache: {} },
  });

  expect(onSnapshotMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledTimes(1);
});

test('unsubscribes from firestore when component unmounts', () => {
  const {
    firestoreMock,
    onSnapshotMock,
    unsubscribeMock,
  } = createMocksForCollection();
  const renderMock = jest.fn().mockReturnValue(<div />);

  const component = mount(
    <FirestoreCollection path="users" render={renderMock} />,
    { context: { firestoreDatabase: firestoreMock, firestoreCache: {} } }
  );

  expect(onSnapshotMock).toHaveBeenCalledTimes(1);
  expect(unsubscribeMock).not.toHaveBeenCalled();

  component.unmount();

  expect(unsubscribeMock).toHaveBeenCalledTimes(1);
});

test('does not unsubscribe if no unsubscribe hook exists', () => {
  const { firestoreMock, unsubscribeMock } = createMocksForCollection();
  const renderMock = jest.fn().mockReturnValue(<div />);

  const component = mount(
    <FirestoreCollection path="users" render={renderMock} />,
    { context: { firestoreDatabase: firestoreMock, firestoreCache: {} } }
  );

  expect(unsubscribeMock).not.toHaveBeenCalled();

  component.instance().unsubscribe = null;
  component.unmount();

  expect(unsubscribeMock).not.toHaveBeenCalled();
});
