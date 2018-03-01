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
    }),
  );
  expect(renderMock).toHaveBeenCalledWith(
    expect.objectContaining({
      isLoading: false,
      data: doc,
      snapshot,
    }),
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
    { context: { firestoreDatabase: firestoreMock, firestoreCache: {} } },
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
    { context: { firestoreDatabase: firestoreMock, firestoreCache: {} } },
  );

  expect(unsubscribeMock).not.toHaveBeenCalled();

  component.instance().unsubscribe = null;
  component.unmount();

  expect(unsubscribeMock).not.toHaveBeenCalled();
});

describe('when incoming "path" prop is the same', () => {
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

  const component = mount(
    <FirestoreDocument path={documentPath} render={renderMock} />,
    {
      context: { firestoreDatabase: firestoreMock, firestoreCache: {} },
    },
  );

  component.setProps({ path: documentPath });

  expect(documentMock).toHaveBeenCalledTimes(1);
  expect(documentMock).toHaveBeenCalledWith(documentPath);
  expect(onSnapshotMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledTimes(3);
  expect(renderMock).toHaveBeenCalledWith(
    expect.objectContaining({
      isLoading: true,
      data: null,
      snapshot: null,
    }),
  );
  expect(renderMock).toHaveBeenCalledWith(
    expect.objectContaining({
      isLoading: false,
      data: doc,
      snapshot,
    }),
  );
});

describe('when incoming "path" prop is different', () => {
  const {
    documentMock,
    firestoreMock,
    onSnapshotMock,
    unsubscribeMock,
  } = createMocksForDocument();
  const renderMock = jest.fn().mockReturnValue(<div />);
  const documentPath1 = 'users/1';
  const documentPath2 = 'users/2';

  const component = mount(
    <FirestoreDocument path={documentPath1} render={renderMock} />,
    { context: { firestoreDatabase: firestoreMock, firestoreCache: {} } },
  );

  describe('when an unsubscribe listener exists', () => {
    test('unsubscribes active listener', () => {
      component.setProps({ path: documentPath2 });

      expect(unsubscribeMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('when an unsubscribe listener does not exist', () => {
    test('does not execute an unsubscribe method', () => {
      unsubscribeMock.mockClear();
      component.instance().unsubscribe = null;
      component.setProps({ path: documentPath2 });

      expect(unsubscribeMock).not.toHaveBeenCalled();
    });
  });

  test('resets isLoading state', () => {
    component.setProps({ path: documentPath2 });

    expect(component.state()).toMatchObject({
      isLoading: true,
    });
  });

  test('wires up a new listener', () => {
    component.setProps({ path: documentPath2 });

    expect(documentMock).toHaveBeenCalledTimes(2);
    expect(documentMock).toHaveBeenCalledWith(documentPath2);
    expect(onSnapshotMock).toHaveBeenCalledTimes(2);
  });
});
