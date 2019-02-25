import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import { FirestoreProvider } from '../';
import { useFirestore, fireQuery } from '../useFirestore';
import {
  createMocksForDocument,
  createMocksForCollection,
} from './helpers/firestore-utils';

describe('hooks', () => {
  describe('useFirestore', () => {
    const Component = () => {
      const db = useFirestore();

      return db ? 'success' : 'fail';
    };

    it('returns the database', () => {
      const { firebaseMock } = createMocksForDocument();

      const wrapper = mount(
        <FirestoreProvider firebase={firebaseMock}>
          <Component />
        </FirestoreProvider>,
      );
      expect(wrapper.text()).toBe('success');
    });

    it('throws an error when the FirestoreProvider is missing', () => {
      expect(() => mount(<Component />)).toThrowError(
        'FirestoreProvider is missing',
      );
    });
  });

  describe('fireQuery', () => {
    let container;

    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container);
      container = null;
    });

    it('is able to request a single document', () => {
      const { firebaseMock, documentMock } = createMocksForDocument({
        id: 'foobar',
        foo: 'bar',
      });
      const Component = () => {
        const { data } = fireQuery()
          .collection('users')
          .doc('foobar')
          .useResult();
        if (data) {
          return <p>{data.foo}</p>;
        }

        return <p>Fail</p>;
      };
      act(() => {
        ReactDOM.render(
          <FirestoreProvider firebase={firebaseMock}>
            <Component />
          </FirestoreProvider>,
          container,
        );
      });
      const label = container.querySelector('p');

      expect(documentMock).toHaveBeenCalledTimes(1);
      expect(label.textContent).toBe('bar');
    });

    it('is able to request a collection', () => {
      const {
        firebaseMock,
        collectionMock,
        onSnapshotMock,
      } = createMocksForCollection([
        {
          id: 'foobar',
          name: 'foo',
          role: 'admin',
        },
        {
          id: 'barfoo',
          name: 'bar',
          role: 'admin',
        },
      ]);
      const Component = () => {
        const { data } = fireQuery()
          .collection('users')
          .where('role', '==', 'admin')
          .limit(5)
          .orderBy('role', 'desc')
          .useResult();

        expect(data).toBeTruthy();

        return (
          <ul>
            {data.map(user => {
              expect(user.id).toBeTruthy();
              return <li key={user.id}>{user.name}</li>;
            })}
          </ul>
        );
      };
      act(() => {
        ReactDOM.render(
          <FirestoreProvider firebase={firebaseMock}>
            <Component />
          </FirestoreProvider>,
          container,
        );
      });
      const items = container.querySelectorAll('li');

      expect(onSnapshotMock).toHaveBeenCalledTimes(1);
      expect(collectionMock).toHaveBeenCalledTimes(1);
      expect(items).toHaveLength(2);
      expect(
        Array.prototype.map.apply(items, [item => item.textContent]),
      ).toEqual(['foo', 'bar']);
    });

    it('is able to perform dummy calls', () => {
      // TODO: improve this unit test: it's all about the _ cal:
      const {
        firebaseMock,
        collectionMock,
        onSnapshotMock,
      } = createMocksForCollection([
        {
          id: 'foobar',
          name: 'foo',
          role: 'admin',
        },
        {
          id: 'barfoo',
          name: 'bar',
          role: 'admin',
        },
      ]);
      const Component = () => {
        const { data } = fireQuery()
          .collection('users')
          .where('role', '==', 'admin')
          .limit(5)
          ._('role', 'desc')
          .useResult();

        expect(data).toBeTruthy();

        return (
          <ul>
            {data.map(user => {
              expect(user.id).toBeTruthy();
              return <li key={user.id}>{user.name}</li>;
            })}
          </ul>
        );
      };
      act(() => {
        ReactDOM.render(
          <FirestoreProvider firebase={firebaseMock}>
            <Component />
          </FirestoreProvider>,
          container,
        );
      });
      const items = container.querySelectorAll('li');

      expect(onSnapshotMock).toHaveBeenCalledTimes(1);
      expect(collectionMock).toHaveBeenCalledTimes(1);
      expect(items).toHaveLength(2);
      expect(
        Array.prototype.map.apply(items, [item => item.textContent]),
      ).toEqual(['foo', 'bar']);
    });
    it('is able to catch errors when retrieving a document', () => {
      const { firebaseMock, documentMock } = createMocksForDocument(
        {
          id: 'foobar',
          foo: 'bar',
        },
        {
          onSnapshotMockError: true,
        },
      );
      const Component = () => {
        const { error } = fireQuery()
          .collection('users')
          .doc('foobar')
          .useResult();
        if (error) {
          return <p>{error.message}</p>;
        }

        return <p>Fail</p>;
      };
      act(() => {
        ReactDOM.render(
          <FirestoreProvider firebase={firebaseMock}>
            <Component />
          </FirestoreProvider>,
          container,
        );
      });
      const label = container.querySelector('p');

      expect(documentMock).toHaveBeenCalledTimes(1);
      expect(label.textContent).toBe('Error with snapshot');
    });

    it('is able to catch errors when retrieving a collection', () => {
      const { firebaseMock, collectionMock } = createMocksForCollection(
        [
          {
            id: 'foobar',
            name: 'foo',
            role: 'admin',
          },
          {
            id: 'barfoo',
            name: 'bar',
            role: 'admin',
          },
        ],
        {
          onSnapshotMockError: true,
        },
      );
      const Component = () => {
        const { error } = fireQuery()
          .collection('users')
          .useResult();
        if (error) {
          return <p>{error.message}</p>;
        }

        return <p>Fail</p>;
      };
      act(() => {
        ReactDOM.render(
          <FirestoreProvider firebase={firebaseMock}>
            <Component />
          </FirestoreProvider>,
          container,
        );
      });
      const label = container.querySelector('p');

      expect(collectionMock).toHaveBeenCalledTimes(1);
      expect(label.textContent).toBe('Error with snapshot');
    });

    it('is able to unsubscribe when retrieving a document', () => {
      const { firebaseMock, unsubscribeMock } = createMocksForDocument({
        id: 'foobar',
        foo: 'bar',
      });
      const Component = () => {
        const { data } = fireQuery()
          .collection('users')
          .doc('foobar')
          .useResult();

        return <p>{data && data.foo}</p>;
      };
      act(() => {
        ReactDOM.render(
          <FirestoreProvider firebase={firebaseMock}>
            <Component />
          </FirestoreProvider>,
          container,
        );
      });
      const label = container.querySelector('p');
      expect(label.textContent).toBe('bar');

      ReactDOM.unmountComponentAtNode(container);

      expect(unsubscribeMock).toHaveBeenCalledTimes(1);
    });

    it('is able unsubscribe when requesting a collection', () => {
      const { firebaseMock, unsubscribeMock } = createMocksForCollection([
        {
          id: 'foobar',
          name: 'foo',
          role: 'admin',
        },
        {
          id: 'barfoo',
          name: 'bar',
          role: 'admin',
        },
      ]);
      const Component = () => {
        const { data } = fireQuery()
          .collection('users')
          .useResult();

        expect(data).toBeTruthy();

        return <ul>{data.map(user => <li key={user.id}>{user.name}</li>)}</ul>;
      };
      act(() => {
        ReactDOM.render(
          <FirestoreProvider firebase={firebaseMock}>
            <Component />
          </FirestoreProvider>,
          container,
        );
      });
      const items = container.querySelectorAll('li');
      expect(
        Array.prototype.map.apply(items, [item => item.textContent]),
      ).toEqual(['foo', 'bar']);

      ReactDOM.unmountComponentAtNode(container);

      expect(unsubscribeMock).toHaveBeenCalledTimes(1);
    });

    it('is able to disable the query when retrieving a document', () => {
      const { firebaseMock, onSnapshotMock } = createMocksForDocument({
        id: 'foobar',
        foo: 'bar',
      });
      const Component = () => {
        const enabled = false;
        fireQuery()
          .collection('users')
          .doc('foobar')
          .useResult(enabled);

        return null;
      };
      act(() => {
        ReactDOM.render(
          <FirestoreProvider firebase={firebaseMock}>
            <Component />
          </FirestoreProvider>,
          container,
        );
      });

      ReactDOM.unmountComponentAtNode(container);

      expect(onSnapshotMock).not.toHaveBeenCalled();
    });

    it('is able to disable the query when requesting a collection', () => {
      const { firebaseMock, onSnapshotMock } = createMocksForCollection([
        {
          id: 'foobar',
          name: 'foo',
          role: 'admin',
        },
        {
          id: 'barfoo',
          name: 'bar',
          role: 'admin',
        },
      ]);
      const Component = () => {
        const enabled = false;
        const { data } = fireQuery()
          .collection('users')
          .useResult(enabled);

        expect(data).toBeTruthy();

        return null;
      };
      act(() => {
        ReactDOM.render(
          <FirestoreProvider firebase={firebaseMock}>
            <Component />
          </FirestoreProvider>,
          container,
        );
      });

      ReactDOM.unmountComponentAtNode(container);

      expect(onSnapshotMock).not.toHaveBeenCalled();
    });

    it('is able to disable the query when requesting a subcollection', () => {
      const { firebaseMock, onSnapshotMock } = createMocksForCollection([
        {
          id: 'foobar',
          name: 'foo',
          role: 'admin',
        },
        {
          id: 'barfoo',
          name: 'bar',
          role: 'admin',
        },
      ]);
      const Component = () => {
        const enabled = false;
        const { data } = fireQuery()
          .collection('users')
          .doc('something')
          .collection('tasks')
          .useResult(enabled);

        expect(data).toBeTruthy();

        return null;
      };
      act(() => {
        ReactDOM.render(
          <FirestoreProvider firebase={firebaseMock}>
            <Component />
          </FirestoreProvider>,
          container,
        );
      });

      ReactDOM.unmountComponentAtNode(container);

      expect(onSnapshotMock).not.toHaveBeenCalled();
    });
  });
});
