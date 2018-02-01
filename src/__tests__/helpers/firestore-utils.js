export function createMocksForCollection(documentCollection) {
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

  return createBaseMocks(snapshot);
}

export function createMocksForDocument(doc) {
  let snapshot;

  if (doc) {
    const { id, ...data } = doc;

    snapshot = {
      id,
      data: () => ({ ...data }),
    };
  }

  return createBaseMocks(snapshot);
}

function createBaseMocks(snapshot) {
  const unsubscribeMock = jest.fn();
  const onSnapshotMock = jest.fn(cb => {
    cb(snapshot);

    return unsubscribeMock;
  });

  const query = { onSnapshot: onSnapshotMock };

  query.orderBy = jest.fn().mockReturnValue(query);
  query.limit = jest.fn().mockReturnValue(query);

  const collectionMock = jest.fn().mockReturnValue(query);
  const documentMock = jest
    .fn()
    .mockReturnValue({ onSnapshot: onSnapshotMock });
  const firestoreMock = { collection: collectionMock, doc: documentMock };

  return {
    firestoreMock,
    collectionMock,
    documentMock,
    query,
    snapshot,
    onSnapshotMock,
    unsubscribeMock,
  };
}
