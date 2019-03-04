import React from 'react';
import { mount } from 'enzyme';
import { FirestoreProvider } from '../';

test('sets timestampsInSnapshots correctly', () => {
  const firestore = {};
  firestore.settings = jest.fn().mockReturnValue(firestore);
  const firebase = {
    firestore: jest.fn().mockReturnValue(firestore),
  };

  mount(
    <FirestoreProvider firebase={firebase}>
      <div>Test</div>
    </FirestoreProvider>,
  );

  expect(firestore.settings).toHaveBeenCalledTimes(0);

  mount(
    <FirestoreProvider firebase={firebase} useTimestampsInSnapshots>
      <div>Test</div>
    </FirestoreProvider>,
  );

  expect(firestore.settings).toHaveBeenCalledTimes(1);
  expect(firestore.settings).toHaveBeenCalledWith({
    timestampsInSnapshots: true,
  });

  mount(
    <FirestoreProvider firebase={firebase} useTimestampsInSnapshots={false}>
      <div>Test</div>
    </FirestoreProvider>,
  );

  expect(firestore.settings).toHaveBeenCalledTimes(2);
  expect(firestore.settings).toHaveBeenCalledWith({
    timestampsInSnapshots: false,
  });
});
