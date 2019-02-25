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

FirestoreQueryBuilder.prototype.useResult = function useResult(enable = true) {
  const [state, setState] = useState({
    error: null,
    isLoading: true,
    snapshot: null,
    data: this.isDoc ? null : [],
  });

  const dependencies = Array.prototype.concat.apply([!!enable], this.calls);

  const firestore = useFirestore();

  useEffect(() => {
    if (!enable) {
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
      if (method !== '_') {
        result = result[method](...args);
      }
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

['_', 'doc', 'collection', 'where', 'limit', 'orderBy'].forEach(method => {
  FirestoreQueryBuilder.prototype[method] = function addCall(...args) {
    const newBuilder = new FirestoreQueryBuilder();
    newBuilder.calls = this.calls.slice();
    newBuilder.calls.push([method, ...args]);
    if (method === 'doc') {
      newBuilder.isDoc = true;
    } else if (method === 'collection') {
      newBuilder.isDoc = false;
    } else {
      newBuilder.isDoc = this.isDoc;
    }
    return newBuilder;
  };
});

export const fireQuery = () => {
  const newBuilder = new FirestoreQueryBuilder();
  newBuilder.calls = [];
  newBuilder.isDoc = false;
  return newBuilder;
};
