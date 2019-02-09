import React from 'react';
import { mount } from 'enzyme';
import { FirestoreDocument, FirestoreProvider } from '../';
import { createMocksForDocument } from './helpers/firestore-utils';

test('initial state set up correctly', () => {
  const {
    firebaseMock,
    documentMock,
    onSnapshotMock,
  } = createMocksForDocument();
  const renderMock = jest.fn().mockReturnValue(<div />);
  const documentPath = 'users/1';

  mount(
    <FirestoreProvider firebase={firebaseMock}>
      <FirestoreDocument path={documentPath} render={renderMock} />
    </FirestoreProvider>,
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

test('renders child prop', () => {
  const {
    firebaseMock,
    documentMock,
    onSnapshotMock,
  } = createMocksForDocument();
  const renderMock = jest.fn().mockReturnValue(<div />);
  const documentPath = 'users/1';

  mount(
    <FirestoreProvider firebase={firebaseMock}>
      <FirestoreDocument path={documentPath}>{renderMock}</FirestoreDocument>,
    </FirestoreProvider>,
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
    firebaseMock,
    documentMock,
    onSnapshotMock,
  } = createMocksForDocument();
  const documentPath = 'users/1';

  mount(
    <FirestoreProvider firebase={firebaseMock}>
      <FirestoreDocument path={documentPath} />
    </FirestoreProvider>,
  );

  expect(documentMock).toHaveBeenCalledTimes(1);
  expect(documentMock).toHaveBeenCalledWith(documentPath);
  expect(onSnapshotMock).toHaveBeenCalledTimes(1);
});
