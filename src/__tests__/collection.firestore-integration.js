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
      data: [],
    })
  );
  expect(renderMock).toHaveBeenCalledWith(
    expect.objectContaining({
      isLoading: false,
      data: documents,
    })
  );
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
