import React from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import { FirestoreContext } from './FirestoreProvider';

const withFirestore = Component => {
  const C = ({ wrappedComponentRef, ...remainingProps }) => (
    <FirestoreContext.Consumer>
      {value => {
        if (!value) {
          throw new Error('FirestoreProvider is missing');
        }
        const { firestoreDatabase } = value;
        return (
          <Component
            {...remainingProps}
            firestore={firestoreDatabase}
            ref={wrappedComponentRef}
          />
        );
      }}
    </FirestoreContext.Consumer>
  );
  C.displayName = `withFirestore(${Component.displayName || Component.name})`;
  C.WrappedComponent = Component;
  C.propTypes = {
    wrappedComponentRef: PropTypes.func,
  };

  return hoistStatics(C, Component);
};

export default withFirestore;
