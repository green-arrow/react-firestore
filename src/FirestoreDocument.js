import { Component } from 'react';
import PropTypes from 'prop-types';
import withFirestore from './withFirestore';

class FirestoreDocument extends Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
    children: PropTypes.func,
    render: PropTypes.func,
    firestore: PropTypes.object.isRequired,
  };

  state = {
    isLoading: true,
    data: null,
    error: null,
    snapshot: null,
  };

  componentDidMount() {
    this.setupFirestoreListener();
  }

  componentWillUnmount() {
    this.handleUnsubscribe();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.path !== this.props.path) {
      this.handleUnsubscribe();

      this.setState({ isLoading: true }, () => this.setupFirestoreListener());
    }
  }

  handleUnsubscribe() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  setupFirestoreListener = () => {
    const { firestore, path } = this.props;
    const documentRef = firestore.doc(path);

    this.unsubscribe = documentRef.onSnapshot(
      this.handleOnSnapshotSuccess,
      this.handleOnSnapshotError,
    );
  };

  handleOnSnapshotError = error => {
    this.setState({
      isLoading: false,
      error,
      data: null,
      snapshot: null,
    });
  };

  handleOnSnapshotSuccess = snapshot => {
    if (snapshot) {
      const newState = {
        isLoading: false,
        error: null,
        snapshot,
      };

      try {
        const documentData = snapshot.data();

        newState.data = {
          id: snapshot.id,
          ...documentData,
        };
      } catch (error) {
        newState.error = error;
      }

      this.setState(newState);
    }
  };

  render() {
    const { children, render } = this.props;

    if (render) return render(this.state);

    if (typeof children === 'function') return children(this.state);

    return null;
  }
}

export default withFirestore(FirestoreDocument);
