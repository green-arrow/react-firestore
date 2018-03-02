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
    }),
  );
  expect(renderMock).toHaveBeenCalledWith(
    expect.objectContaining({
      isLoading: false,
      snapshot,
      data: documents,
    }),
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
    { context: { firestoreDatabase: firestoreMock, firestoreCache: {} } },
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
    { context: { firestoreDatabase: firestoreMock, firestoreCache: {} } },
  );

  expect(unsubscribeMock).not.toHaveBeenCalled();

  component.instance().unsubscribe = null;
  component.unmount();

  expect(unsubscribeMock).not.toHaveBeenCalled();
});

describe('when componentWillReceiveProps is executed', () => {
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
    unsubscribeMock,
  } = createMocksForCollection(documents);
  const renderMock = jest.fn().mockReturnValue(<div />);
  const collectionName1 = 'users';
  const collectionName2 = 'posts';
  let component = null;

  beforeEach(() => jest.clearAllMocks());

  describe('when existing "path" prop is identical to incoming "path" prop', () => {
    beforeEach(() => {
      component = mount(
        <FirestoreCollection
          path={collectionName1}
          sort="date"
          limit={5}
          filter={['name', '==', 'Mike']}
          render={renderMock}
        />,
        {
          context: { firestoreDatabase: firestoreMock, firestoreCache: {} },
        },
      );
      component.setProps({ path: collectionName1 });
    });

    test('does not change isLoading state', () => {
      expect(renderMock).toHaveBeenCalledTimes(3);
      expect(renderMock).toHaveBeenCalledWith(
        expect.objectContaining({
          isLoading: true,
          data: [],
          snapshot: null,
        }),
      );
      expect(renderMock).toHaveBeenCalledWith(
        expect.objectContaining({
          isLoading: false,
          data: documents,
          snapshot,
        }),
      );
    });

    test('does not execute an unsubscribe method', () => {
      expect(unsubscribeMock).not.toHaveBeenCalled();
    });

    test('does not request the collection again', () => {
      expect(collectionMock).toHaveBeenCalledTimes(1);
      expect(collectionMock).toHaveBeenCalledWith(collectionName1);
      expect(onSnapshotMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('when existing "sort" prop is identical to incoming "sort" prop', () => {
    beforeEach(() => {
      component = mount(
        <FirestoreCollection
          path={collectionName1}
          sort="date"
          limit={5}
          filter={['name', '==', 'Mike']}
          render={renderMock}
        />,
        {
          context: { firestoreDatabase: firestoreMock, firestoreCache: {} },
        },
      );
      component.setProps({ sort: 'date' });
    });

    test('does not change isLoading state', () => {
      expect(renderMock).toHaveBeenCalledTimes(3);
      expect(renderMock).toHaveBeenCalledWith(
        expect.objectContaining({
          isLoading: true,
          data: [],
          snapshot: null,
        }),
      );
      expect(renderMock).toHaveBeenCalledWith(
        expect.objectContaining({
          isLoading: false,
          data: documents,
          snapshot,
        }),
      );
    });

    test('does not execute an unsubscribe method', () => {
      expect(unsubscribeMock).not.toHaveBeenCalled();
    });

    test('does not request the collection again', () => {
      expect(collectionMock).toHaveBeenCalledTimes(1);
      expect(collectionMock).toHaveBeenCalledWith(collectionName1);
      expect(onSnapshotMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('when existing "limit" prop is identical to incoming "limit" prop', () => {
    beforeEach(() => {
      component = mount(
        <FirestoreCollection
          path={collectionName1}
          sort="date"
          limit={5}
          filter={['name', '==', 'Mike']}
          render={renderMock}
        />,
        {
          context: { firestoreDatabase: firestoreMock, firestoreCache: {} },
        },
      );
      component.setProps({ limit: 5 });
    });
    test('does not change isLoading state', () => {
      expect(renderMock).toHaveBeenCalledTimes(3);
      expect(renderMock).toHaveBeenCalledWith(
        expect.objectContaining({
          isLoading: true,
          data: [],
          snapshot: null,
        }),
      );
      expect(renderMock).toHaveBeenCalledWith(
        expect.objectContaining({
          isLoading: false,
          data: documents,
          snapshot,
        }),
      );
    });

    test('does not execute an unsubscribe method', () => {
      expect(unsubscribeMock).not.toHaveBeenCalled();
    });

    test('does not request the collection again', () => {
      expect(collectionMock).toHaveBeenCalledTimes(1);
      expect(collectionMock).toHaveBeenCalledWith(collectionName1);
      expect(onSnapshotMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('when existing "filter" prop is identical to incoming "filter" prop', () => {
    beforeEach(() => {
      component = mount(
        <FirestoreCollection
          path={collectionName1}
          sort="date"
          limit={5}
          filter={['name', '==', 'Mike']}
          render={renderMock}
        />,
        {
          context: { firestoreDatabase: firestoreMock, firestoreCache: {} },
        },
      );
      component.setProps({ filter: ['name', '==', 'Mike'] });
    });

    test('does not change isLoading state', () => {
      expect(renderMock).toHaveBeenCalledTimes(3);
      expect(renderMock).toHaveBeenCalledWith(
        expect.objectContaining({
          isLoading: true,
          data: [],
          snapshot: null,
        }),
      );
      expect(renderMock).toHaveBeenCalledWith(
        expect.objectContaining({
          isLoading: false,
          data: documents,
          snapshot,
        }),
      );
    });

    test('does not execute an unsubscribe method', () => {
      expect(unsubscribeMock).not.toHaveBeenCalled();
    });

    test('does not request the collection again', () => {
      expect(collectionMock).toHaveBeenCalledTimes(1);
      expect(collectionMock).toHaveBeenCalledWith(collectionName1);
      expect(onSnapshotMock).toHaveBeenCalledTimes(1);
    });
  });

    xdescribe('when existing "path" prop is different to incoming "path" prop', () => {
        beforeEach(() => {
            component = mount(
                <FirestoreCollection
                    path={collectionName1}
                    sort="date"
                    limit={5}
                    filter={['name', '==', 'Mike']}
                    render={renderMock}
                />,
                {
                    context: { firestoreDatabase: firestoreMock, firestoreCache: {} },
                },
            );
        });
    });

  describe('when existing props are different than incoming props', () => {
    beforeEach(() => {
      component = mount(
        <FirestoreCollection
          path={collectionName1}
          sort="date"
          limit={5}
          filter={['name', '==', 'Mike']}
          render={renderMock}
        />,
        {
          context: { firestoreDatabase: firestoreMock, firestoreCache: {} },
        },
      );
    });

    test('resets isLoading state', () => {
      component.setProps({ path: collectionName2 });

      expect(renderMock).toHaveBeenCalledWith(
        expect.objectContaining({
          isLoading: true,
        }),
      );
    });

    test('wires up a new listener', () => {
      component.setProps({ path: collectionName2 });

      expect(collectionMock).toHaveBeenCalledTimes(2);
      expect(collectionMock).toHaveBeenCalledWith(collectionName2);
      expect(onSnapshotMock).toHaveBeenCalledTimes(2);
    });

    describe('when an unsubscribe listener exists', () => {
      test('unsubscribes active listener', () => {
        component.setProps({ path: collectionName2 });

        expect(unsubscribeMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('when an unsubscribe listener does not exist', () => {
      test('does not execute an unsubscribe method', () => {
        component.instance().unsubscribe = null;
        component.setProps({ path: collectionName2 });

        expect(unsubscribeMock).not.toHaveBeenCalled();
      });
    });
  });
});
