import React from 'react';
import { mount } from 'enzyme';
import { FirestoreCollection } from '../';
import { createMocksForCollection } from './helpers/firestore-utils';

test('should handle error getting snapshot', () => {
  const options = { onSnapshotMockError: true };
  const {
    firestoreMock,
    collectionMock,
    onSnapshotMock,
  } = createMocksForCollection(null, options);
  const renderMock = jest.fn().mockReturnValue(<div />);
  const collectionName = 'error';

  const wrapper = mount(
    <FirestoreCollection path={collectionName} render={renderMock} />,
    { context: { firestoreDatabase: firestoreMock, firestoreCache: {} } },
  );

  expect(collectionMock).toHaveBeenCalledTimes(1);
  expect(collectionMock).toHaveBeenCalledWith(collectionName);
  expect(onSnapshotMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledTimes(2);
  expect(renderMock).toHaveBeenCalledWith(
    expect.objectContaining({
      isLoading: true,
      data: [],
      error: null,
      snapshot: null,
    }),
  );
  expect(wrapper.state('error')).not.toBe(null);
});
