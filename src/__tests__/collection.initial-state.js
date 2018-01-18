import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import { FirestoreProvider, FirestoreCollection } from '../';
import { createMocksForCollection } from './helpers/firestore-utils';

test('initial state set up correctly', () => {
  const {
    firestoreMock,
    collectionMock,
    onSnapshotMock,
  } = createMocksForCollection();
  const renderMock = jest.fn().mockReturnValue(<div />);
  const collectionName = 'users';

  const component = mount(
    <FirestoreCollection path={collectionName} render={renderMock} />,
    { context: { firestoreDatabase: firestoreMock, firestoreCache: {} } }
  );

  expect(collectionMock).toHaveBeenCalledTimes(1);
  expect(collectionMock).toHaveBeenCalledWith(collectionName);
  expect(onSnapshotMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith(
    expect.objectContaining({
      isLoading: true,
      data: [],
    })
  );
});
