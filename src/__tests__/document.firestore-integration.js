import React from 'react';
import { mount } from 'enzyme';
import { FirestoreDocument } from '../';
import { createMocksForDocument } from './helpers/firestore-utils';

test('integrates with firestore using onSnapshot', () => {
  const doc = {
    id: 1,
    name: 'John Smith',
  };
  const {
    firestoreMock,
    documentMock,
    snapshot,
    onSnapshotMock,
  } = createMocksForDocument(doc);
  const renderMock = jest.fn().mockReturnValue(<div />);
  const documentPath = 'users/1';

  mount(<FirestoreDocument path={documentPath} render={renderMock} />, {
    context: { firestoreDatabase: firestoreMock, firestoreCache: {} },
  });

  expect(documentMock).toHaveBeenCalledTimes(1);
  expect(documentMock).toHaveBeenCalledWith(documentPath);
  expect(onSnapshotMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledTimes(2);
  expect(renderMock).toHaveBeenCalledWith(
    expect.objectContaining({
      isLoading: true,
      data: null,
      snapshot: null,
    })
  );
  expect(renderMock).toHaveBeenCalledWith(
    expect.objectContaining({
      isLoading: false,
      data: doc,
      snapshot,
    })
  );
});

test('unsubscribes from firestore when component unmounts', () => {
  const {
    firestoreMock,
    onSnapshotMock,
    unsubscribeMock,
  } = createMocksForDocument();
  const renderMock = jest.fn().mockReturnValue(<div />);

  const component = mount(
    <FirestoreDocument path="users/1" render={renderMock} />,
    { context: { firestoreDatabase: firestoreMock, firestoreCache: {} } }
  );

  expect(onSnapshotMock).toHaveBeenCalledTimes(1);
  expect(unsubscribeMock).not.toHaveBeenCalled();

  component.unmount();

  expect(unsubscribeMock).toHaveBeenCalledTimes(1);
});

test('does not unsubscribe if no unsubscribe hook exists', () => {
  const { firestoreMock, unsubscribeMock } = createMocksForDocument();
  const renderMock = jest.fn().mockReturnValue(<div />);

  const component = mount(
    <FirestoreDocument path="users/1" render={renderMock} />,
    { context: { firestoreDatabase: firestoreMock, firestoreCache: {} } }
  );

  expect(unsubscribeMock).not.toHaveBeenCalled();

  component.instance().unsubscribe = null;
  component.unmount();

  expect(unsubscribeMock).not.toHaveBeenCalled();
});
