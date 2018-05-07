import React from 'react';
import { mount } from 'enzyme';
import { FirestoreDocument } from '../';
import { createMocksForDocument } from './helpers/firestore-utils';

test('initial state set up correctly', () => {
  const {
    firestoreMock,
    documentMock,
    onSnapshotMock,
  } = createMocksForDocument();
  const renderMock = jest.fn().mockReturnValue(<div />);
  const documentPath = 'users/1';

  mount(<FirestoreDocument path={documentPath} render={renderMock} />, {
    context: { firestoreDatabase: firestoreMock, firestoreCache: {} },
  });

  expect(documentMock).toHaveBeenCalledTimes(1);
  expect(documentMock).toHaveBeenCalledWith(documentPath);
  expect(onSnapshotMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith(
    expect.objectContaining({
      isLoading: true,
      data: null,
    }),
  );
});

test('renders child prop', () => {
  const {
    firestoreMock,
    documentMock,
    onSnapshotMock,
  } = createMocksForDocument();
  const renderMock = jest.fn().mockReturnValue(<div />);
  const documentPath = 'users/1';

  mount(
    <FirestoreDocument path={documentPath}>{renderMock}</FirestoreDocument>,
    {
      context: { firestoreDatabase: firestoreMock, firestoreCache: {} },
    },
  );

  expect(documentMock).toHaveBeenCalledTimes(1);
  expect(documentMock).toHaveBeenCalledWith(documentPath);
  expect(onSnapshotMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith(
    expect.objectContaining({
      isLoading: true,
      data: null,
    }),
  );
});

test('renders nothing if passed no render prop or children', () => {
  const {
    firestoreMock,
    documentMock,
    onSnapshotMock,
  } = createMocksForDocument();
  const documentPath = 'users/1';

  mount(<FirestoreDocument path={documentPath} />, {
    context: { firestoreDatabase: firestoreMock, firestoreCache: {} },
  });

  expect(documentMock).toHaveBeenCalledTimes(1);
  expect(documentMock).toHaveBeenCalledWith(documentPath);
  expect(onSnapshotMock).toHaveBeenCalledTimes(1);
});
