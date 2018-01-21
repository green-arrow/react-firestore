import React from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import Firestore from './Firestore';

const withFirestore = Component => {
  const C = props => {
    const { wrappedComponentRef, ...remainingProps } = props;
    return (
      <Firestore
        render={firestoreComponentProps => (
          <Component
            {...remainingProps}
            {...firestoreComponentProps}
            ref={wrappedComponentRef}
          />
        )}
      />
    );
  };

  C.displayName = `withFirestore(${Component.displayName || Component.name})`;
  C.WrappedComponent = Component;
  C.propTypes = {
    wrappedComponentRef: PropTypes.func,
  };

  return hoistStatics(C, Component);
};

export default withFirestore;
