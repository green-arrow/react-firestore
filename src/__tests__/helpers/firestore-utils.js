export function createMocksForCollection(documentCollection, options = {}) {
  let snapshot;

  if (documentCollection) {
    snapshot = {
      docs: documentCollection.map(doc => {
        const { id, ...data } = doc;

        return {
          id,
          data: () => ({ ...data }),
        };
      }),
    };
  }

  return createBaseMocks(snapshot, options);
}

export function createMocksForDocument(doc, options = {}) {
  let snapshot;

  if (doc) {
    const { id, ...data } = doc;

    snapshot = {
      id,
      data: () => {
        if (options.onDataMockError) {
          throw new Error('Error retrieving data');
        } else {
          return { ...data };
        }
      },
    };
  }

  return createBaseMocks(snapshot, options);
}

function createBaseMocks(snapshot, options) {
  const unsubscribeMock = jest.fn();
  const onSnapshotMock = jest.fn((successCb, errorCb) => {
    if (options && options.onSnapshotMockError) {
      errorCb(new Error('Error with snapshot'));
    } else {
      successCb(snapshot);
    }

    return unsubscribeMock;
  });

  const query = { onSnapshot: onSnapshotMock };

  query.orderBy = jest.fn().mockReturnValue(query);
  query.limit = jest.fn().mockReturnValue(query);
  query.where = jest.fn().mockReturnValue(query);

  const collectionMock = jest.fn().mockReturnValue(query);
  const documentMock = jest
    .fn()
    .mockReturnValue({ onSnapshot: onSnapshotMock });
  const firestoreMock = {
    settings: jest.fn(),
    collection: collectionMock,
    doc: documentMock,
  };

  const firebaseMock = {
    firestore: () => firestoreMock,
  };

  return {
    firebaseMock,
    firestoreMock,
    collectionMock,
    documentMock,
    query,
    snapshot,
    onSnapshotMock,
    unsubscribeMock,
  };
}
