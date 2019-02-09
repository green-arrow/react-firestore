import React from 'react';
import { mount } from 'enzyme';
import { FirestoreDocument, FirestoreProvider } from '../';
import { createMocksForDocument } from './helpers/firestore-utils';

test('should handle error getting snapshot', () => {
  const options = { onSnapshotMockError: true };
  const { firebaseMock, documentMock, onSnapshotMock } = createMocksForDocument(
    null,
    options,
  );
  const renderMock = jest.fn().mockReturnValue(<div />);
  const documentPath = 'error/1';

  const wrapper = mount(
    <FirestoreProvider firebase={firebaseMock}>
      <FirestoreDocument path={documentPath} render={renderMock} />
    </FirestoreProvider>,
  );
  const component = wrapper.find(FirestoreDocument).children(0);

  expect(documentMock).toHaveBeenCalledTimes(1);
  expect(documentMock).toHaveBeenCalledWith(documentPath);
  expect(onSnapshotMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledTimes(2);
  expect(renderMock).toHaveBeenCalledWith(
    expect.objectContaining({
      isLoading: true,
      data: null,
      error: null,
      snapshot: null,
    }),
  );
  expect(renderMock).toHaveBeenCalledWith(
    expect.objectContaining({
      isLoading: false,
      data: null,
      error: expect.any(Error),
      snapshot: null,
    }),
  );
  expect(component.state('error')).not.toBe(null);
});

test('should handle error when document id does not exist', () => {
  const doc = {
    id: 1,
    name: 'John Smith',
  };
  const options = { onDataMockError: true };
  const { firebaseMock, documentMock, onSnapshotMock } = createMocksForDocument(
    doc,
    options,
  );
  const renderMock = jest.fn().mockReturnValue(<div />);
  const documentPath = 'error/1';

  const wrapper = mount(
    <FirestoreProvider firebase={firebaseMock}>
      <FirestoreDocument path={documentPath} render={renderMock} />
    </FirestoreProvider>,
  );
  const component = wrapper.find(FirestoreDocument).children(0);

  expect(documentMock).toHaveBeenCalledTimes(1);
  expect(documentMock).toHaveBeenCalledWith(documentPath);
  expect(onSnapshotMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledTimes(2);
  expect(renderMock).toHaveBeenCalledWith(
    expect.objectContaining({
      isLoading: false,
      data: null,
      error: expect.any(Error),
    }),
  );
  expect(component.state('error')).not.toBe(null);
});
