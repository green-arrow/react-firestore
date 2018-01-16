import { Component } from 'react';
import PropTypes from 'prop-types';
import FirestoreCache from './FirestoreCache';

export default class FirestoreProvider extends Component {
  static childContextTypes = {
    firestoreDatabase: PropTypes.object.isRequired,
    firestoreCache: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    const { firebase } = props;

    this.state = {
      firestoreDatabase: firebase.firestore(),
      firestoreCache: new FirestoreCache(),
    };
  }

  getChildContext() {
    const { firestoreDatabase, firestoreCache } = this.state;

    return { firestoreDatabase, firestoreCache };
  }

  render() {
    return this.props.children;
  }
}
