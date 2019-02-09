import { useState, useEffect, useContext } from 'react';
import { FirestoreContext } from './FirestoreProvider';

export const useFirestore = () => {
  const value = useContext(FirestoreContext);
  if (!value) {
    throw new Error('FirestoreProvider is missing');
  }
  return value.firestoreDatabase;
};

function FirestoreQueryBuilder() {}

const getDataFromDoc = doc => ({
  id: doc.id,
  ...doc.data(),
});

FirestoreQueryBuilder.prototype.useSnapshot = function useSnapshot() {
  const [state, setState] = useState({
    error: null,
    isLoading: true,
    snapshot: null,
    data: this.isDoc ? null : [],
  });

  const dependencies = Array.prototype.concat.apply([this.enable], this.calls);

  const firestore = useFirestore();

  useEffect(() => {
    if (!this.enable) {
      setState({
        error: null,
        isLoading: false,
        snapshot: null,
        data: this.isDoc ? null : [],
      });
      return () => {};
    }
    setState({
      error: null,
      isLoading: true,
      snapshot: null,
      data: this.isDoc ? null : [],
    });
    let result = firestore;
    this.calls.forEach(([method, ...args]) => {
      result = result[method](...args);
    });
    const unsubscribe = result.onSnapshot(
      snapshot =>
        setState({
          error: null,
          isLoading: false,
          snapshot,
          data: snapshot.docs
            ? snapshot.docs.map(getDataFromDoc)
            : getDataFromDoc(snapshot),
        }),
      error =>
        setState({
          error,
          isLoading: false,
          snapshot: null,
          data: this.isDoc ? null : [],
        }),
    );
    return unsubscribe;
  }, dependencies);

  return state;
};

['doc', 'collection', 'where', 'limit', 'orderBy'].forEach(method => {
  FirestoreQueryBuilder.prototype[method] = function addCall(...args) {
    const newBuilder = new FirestoreQueryBuilder();
    newBuilder.calls = this.calls.slice();
    newBuilder.calls.push([method, ...args]);
    newBuilder.enable = this.enable;
    newBuilder.isDoc = this.isDoc || method === 'doc';
    return newBuilder;
  };
});

export const query = (enable = true) => {
  const newBuilder = new FirestoreQueryBuilder();
  newBuilder.calls = [];
  newBuilder.enable = enable;
  newBuilder.isDoc = false;
  return newBuilder;
};
