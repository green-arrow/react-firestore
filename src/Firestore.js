import React from 'react';
import PropTypes from 'prop-types';
import { FirestoreContext } from './FirestoreProvider';

const Firestore = ({ render }) => (
  <FirestoreContext.Consumer>
    {({ firestoreDatabase }) => render({ firestore: firestoreDatabase })}
  </FirestoreContext.Consumer>
);

Firestore.propTypes = {
  render: PropTypes.func.isRequired,
};

export default Firestore;
