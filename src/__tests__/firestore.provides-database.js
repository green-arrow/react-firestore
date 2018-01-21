import React from 'react';
import { mount } from 'enzyme';
import { Firestore } from '../';

test('provides the firestore database in render function', () => {
  const firestore = {};
  const renderMock = jest.fn().mockReturnValue(<div />);

  mount(<Firestore render={renderMock} />, {
    context: { firestoreDatabase: firestore },
  });

  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith({ firestore });
});
