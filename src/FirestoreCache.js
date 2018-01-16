export default class FirestoreCache {
  constructor() {
    this.collections = {};
  }

  addDocuments = (collectionName, docs) => {
    const cachedCollection = this.collections[collectionName];
    let updatedCollectionCache = {};

    if (cachedCollection) {
      updatedCollectionCache = { ...cachedCollection };
    }

    docs.forEach(doc => {
      const { id, ...docData } = doc;

      updatedCollectionCache[id] = { ...docData };
    });

    this.collections[collectionName] = updatedCollectionCache;
  };
}
