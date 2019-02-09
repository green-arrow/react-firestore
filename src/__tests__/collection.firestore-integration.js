import React from 'react';
import { mount } from 'enzyme';
import { FirestoreCollection, FirestoreProvider } from '../';
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
    firebaseMock,
    collectionMock,
    snapshot,
    onSnapshotMock,
  } = createMocksForCollection(documents);
  const renderMock = jest.fn().mockReturnValue(<div />);
  const collectionName = 'users';

  mount(
    <FirestoreProvider firebase={firebaseMock}>
      <FirestoreCollection path={collectionName} render={renderMock} />
    </FirestoreProvider>,
  );

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
  const { firebaseMock, onSnapshotMock } = createMocksForCollection();
  const renderMock = jest.fn().mockReturnValue(<div />);

  mount(
    <FirestoreProvider firebase={firebaseMock}>
      <FirestoreCollection path="users" render={renderMock} />
    </FirestoreProvider>,
  );

  expect(onSnapshotMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledTimes(1);
});

test('unsubscribes from firestore when component unmounts', () => {
  const {
    firebaseMock,
    onSnapshotMock,
    unsubscribeMock,
  } = createMocksForCollection();
  const renderMock = jest.fn().mockReturnValue(<div />);

  const component = mount(
    <FirestoreProvider firebase={firebaseMock}>
      <FirestoreCollection path="users" render={renderMock} />
    </FirestoreProvider>,
  );

  expect(onSnapshotMock).toHaveBeenCalledTimes(1);
  expect(unsubscribeMock).not.toHaveBeenCalled();

  component.unmount();

  expect(unsubscribeMock).toHaveBeenCalledTimes(1);
});

test('does not unsubscribe if no unsubscribe hook exists', () => {
  const { firebaseMock, unsubscribeMock } = createMocksForCollection();
  const renderMock = jest.fn().mockReturnValue(<div />);

  const wrapper = mount(
    <FirestoreProvider firebase={firebaseMock}>
      <FirestoreCollection path="users" render={renderMock} />
    </FirestoreProvider>,
  );
  const component = wrapper.find(FirestoreCollection).children(0);

  expect(unsubscribeMock).not.toHaveBeenCalled();

  component.instance().unsubscribe = null;
  wrapper.unmount();

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
    firebaseMock,
    collectionMock,
    snapshot,
    onSnapshotMock,
    unsubscribeMock,
  } = createMocksForCollection(documents);
  const renderMock = jest.fn().mockReturnValue(<div />);
  const collectionName1 = 'users';
  const collectionName2 = 'posts';
  // eslint-disable-next-line react/prop-types
  const Wrapper = props => (
    <FirestoreProvider firebase={firebaseMock}>
      <FirestoreCollection {...props} />
    </FirestoreProvider>
  );
  let wrapper = null;

  const resetsIsLoadingState = newProp => {
    wrapper.setProps(newProp);

    expect(renderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        isLoading: true,
      }),
    );
  };

  const wiresUpANewListener = (newProp, expectedCollection) => {
    wrapper.setProps(newProp);

    expect(collectionMock).toHaveBeenCalledTimes(2);
    expect(collectionMock).toHaveBeenCalledWith(expectedCollection);
    expect(onSnapshotMock).toHaveBeenCalledTimes(2);
  };

  const unsubscribesActiveListener = newProp => {
    wrapper.setProps(newProp);

    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  };

  const doesNotExecuteUnsubscribe = newProp => {
    wrapper.setProps(newProp);

    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  };

  beforeEach(() => jest.clearAllMocks());

  describe('when existing "path" prop is identical to incoming "path" prop', () => {
    beforeEach(() => {
      wrapper = mount(
        <Wrapper
          path={collectionName1}
          sort="date"
          limit={5}
          filter={['name', '==', 'Mike']}
          render={renderMock}
        />,
      );
      wrapper.setProps({ path: collectionName1 });
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
      wrapper = mount(
        <Wrapper
          path={collectionName1}
          sort="date"
          limit={5}
          filter={['name', '==', 'Mike']}
          render={renderMock}
        />,
      );
      wrapper.setProps({ sort: 'date' });
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
      wrapper = mount(
        <Wrapper
          path={collectionName1}
          sort="date"
          limit={5}
          filter={['name', '==', 'Mike']}
          render={renderMock}
        />,
      );
      wrapper.setProps({ limit: 5 });
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
      wrapper = mount(
        <Wrapper
          path={collectionName1}
          sort="date"
          limit={5}
          filter={['name', '==', 'Mike']}
          render={renderMock}
        />,
      );
      wrapper.setProps({ filter: ['name', '==', 'Mike'] });
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

  describe('when existing "path" prop is different than incoming "path" prop', () => {
    beforeEach(() => {
      wrapper = mount(
        <Wrapper
          path={collectionName1}
          sort="date"
          limit={5}
          filter={['name', '==', 'Mike']}
          render={renderMock}
        />,
      );
    });
    test('resets isLoading state', () => {
      resetsIsLoadingState({ path: collectionName2 });
    });

    test('wires up a new listener', () => {
      wiresUpANewListener({ path: collectionName2 }, collectionName2);
    });

    test('unsubscribes if an unsubscribe hook exists', () => {
      unsubscribesActiveListener({ path: collectionName2 });
    });

    test('does not unsubscribe if no unsubscribe hook exists', () => {
      doesNotExecuteUnsubscribe({ path: collectionName2 });
    });
  });

  describe('when existing "sort" prop is different than incoming "sort" prop', () => {
    beforeEach(() => {
      wrapper = mount(
        <Wrapper
          path={collectionName1}
          sort="date"
          limit={5}
          filter={['name', '==', 'Mike']}
          render={renderMock}
        />,
      );
    });
    test('resets isLoading state', () => {
      resetsIsLoadingState({ sort: 'name' });
    });

    test('wires up a new listener', () => {
      wiresUpANewListener({ sort: 'name' }, collectionName1);
    });

    test('unsubscribes if an unsubscribe hook exists', () => {
      unsubscribesActiveListener({ sort: 'name' });
    });

    test('does not unsubscribe if no unsubscribe hook exists', () => {
      doesNotExecuteUnsubscribe({ sort: 'name' });
    });
  });

  describe('when existing "limit" prop is different than incoming "limit" prop', () => {
    beforeEach(() => {
      wrapper = mount(
        <Wrapper
          path={collectionName1}
          sort="date"
          limit={5}
          filter={['name', '==', 'Mike']}
          render={renderMock}
        />,
      );
    });
    test('resets isLoading state', () => {
      resetsIsLoadingState({ limit: 20 });
    });

    test('wires up a new listener', () => {
      wiresUpANewListener({ limit: 20 }, collectionName1);
    });

    test('unsubscribes if an unsubscribe hook exists', () => {
      unsubscribesActiveListener({ limit: 20 });
    });

    test('does not unsubscribe if no unsubscribe hook exists', () => {
      doesNotExecuteUnsubscribe({ limit: 20 });
    });
  });

  describe('when existing "filter" prop is different than incoming "filter" prop', () => {
    beforeEach(() => {
      wrapper = mount(
        <Wrapper
          path={collectionName1}
          sort="date"
          limit={5}
          filter={[['firstName', '==', 'Mike'], ['lastName', '==', 'Smith']]}
          render={renderMock}
        />,
      );
    });
    test('resets isLoading state', () => {
      resetsIsLoadingState({
        filter: [['firstName', '==', 'Steve'], ['lastName', '==', 'Jones']],
      });
    });

    test('wires up a new listener', () => {
      wiresUpANewListener(
        { filter: [['firstName', '==', 'Steve'], ['lastName', '==', 'Jones']] },
        collectionName1,
      );
    });

    test('unsubscribes if an unsubscribe hook exists', () => {
      unsubscribesActiveListener({
        filter: [['firstName', '==', 'Steve'], ['lastName', '==', 'Jones']],
      });
    });

    test('does not unsubscribe if no unsubscribe hook exists', () => {
      doesNotExecuteUnsubscribe({
        filter: [['firstName', '==', 'Steve'], ['lastName', '==', 'Jones']],
      });
    });
  });
});
