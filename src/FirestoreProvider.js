import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FirestoreCache from './FirestoreCache';

export const FirestoreContext = React.createContext(null);

export default class FirestoreProvider extends Component {
  static propTypes = {
    firebase: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    useTimestampsInSnapshots: PropTypes.bool,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);

    const { firebase, useTimestampsInSnapshots } = props;
    const firestore = firebase.firestore();
    if (typeof useTimestampsInSnapshots !== 'undefined') {
      const settings = { timestampsInSnapshots: useTimestampsInSnapshots };
      firestore.settings(settings);
    }

    this.state = {
      firestoreDatabase: firestore,
      firestoreCache: new FirestoreCache(),
    };
  }

  render() {
    return (
      <FirestoreContext.Provider value={this.state}>
        {this.props.children}
      </FirestoreContext.Provider>
    );
  }
}
