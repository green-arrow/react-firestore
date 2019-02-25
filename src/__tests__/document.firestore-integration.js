import React from 'react';
import { mount } from 'enzyme';
import { FirestoreDocument, FirestoreProvider } from '../';
import { createMocksForDocument } from './helpers/firestore-utils';

test('integrates with firestore using onSnapshot', () => {
  const doc = {
    id: 1,
    name: 'John Smith',
  };
  const {
    firebaseMock,
    documentMock,
    snapshot,
    onSnapshotMock,
  } = createMocksForDocument(doc);
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
    firebaseMock,
    onSnapshotMock,
    unsubscribeMock,
  } = createMocksForDocument();
  const renderMock = jest.fn().mockReturnValue(<div />);

  const component = mount(
    <FirestoreProvider firebase={firebaseMock}>
      <FirestoreDocument path="users/1" render={renderMock} />,
    </FirestoreProvider>,
  );

  expect(onSnapshotMock).toHaveBeenCalledTimes(1);
  expect(unsubscribeMock).not.toHaveBeenCalled();

  component.unmount();

  expect(unsubscribeMock).toHaveBeenCalledTimes(1);
});

test('does not unsubscribe if no unsubscribe hook exists', () => {
  const { firebaseMock, unsubscribeMock } = createMocksForDocument();
  const renderMock = jest.fn().mockReturnValue(<div />);

  const wrapper = mount(
    <FirestoreProvider firebase={firebaseMock}>
      <FirestoreDocument path="users/1" render={renderMock} />,
    </FirestoreProvider>,
  );
  const component = wrapper.find(FirestoreDocument).children(0);

  expect(unsubscribeMock).not.toHaveBeenCalled();

  component.instance().unsubscribe = null;
  wrapper.unmount();

  expect(unsubscribeMock).not.toHaveBeenCalled();
});

describe('when props change', () => {
  const doc = {
    id: 1,
    name: 'John Smith',
  };
  const {
    documentMock,
    firebaseMock,
    snapshot,
    onSnapshotMock,
    unsubscribeMock,
  } = createMocksForDocument(doc);
  const renderMock = jest.fn().mockReturnValue(<div />);
  const documentPath1 = 'users/1';
  const documentPath2 = 'users/2';

  // eslint-disable-next-line react/prop-types
  const Wrapper = ({ path }) => (
    <FirestoreProvider firebase={firebaseMock}>
      <FirestoreDocument path={path} render={renderMock} />
    </FirestoreProvider>
  );

  const wrapper = mount(<Wrapper path={documentPath1} />);

  const component = wrapper.find(FirestoreDocument).children(0);

  describe('when "path" prop is the same', () => {
    beforeEach(() => wrapper.setProps({ path: documentPath1 }));

    test('it does not change isLoading state', () => {
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

    test('does not execute an unsubscribe method', () => {
      expect(unsubscribeMock).not.toHaveBeenCalled();
    });

    test('does not request the document again', () => {
      expect(documentMock).toHaveBeenCalledTimes(1);
      expect(documentMock).toHaveBeenCalledWith(documentPath1);
      expect(onSnapshotMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('when "path" prop is different', () => {
    test('resets isLoading state', () => {
      renderMock.mockClear();
      wrapper.setProps({ path: documentPath2 });

      expect(renderMock).toHaveBeenCalledWith(
        expect.objectContaining({
          isLoading: true,
        }),
      );
    });

    test('wires up a new listener', () => {
      wrapper.setProps({ path: documentPath2 });

      expect(documentMock).toHaveBeenCalledTimes(2);
      expect(documentMock).toHaveBeenCalledWith(documentPath2);
      expect(onSnapshotMock).toHaveBeenCalledTimes(2);
    });

    describe('when an unsubscribe listener exists', () => {
      test('unsubscribes active listener', () => {
        wrapper.setProps({ path: documentPath2 });

        expect(unsubscribeMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('when an unsubscribe listener does not exist', () => {
      test('does not execute an unsubscribe method', () => {
        unsubscribeMock.mockClear();
        component.instance().unsubscribe = null;
        wrapper.setProps({ path: documentPath2 });

        expect(unsubscribeMock).not.toHaveBeenCalled();
      });
    });
  });
});
