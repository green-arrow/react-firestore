import { Component } from 'react';
import PropTypes from 'prop-types';

class FirestoreDocument extends Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
    children: PropTypes.func,
    render: PropTypes.func,
  };

  static contextTypes = {
    firestoreDatabase: PropTypes.object.isRequired,
    firestoreCache: PropTypes.object.isRequired,
  };

  state = {
    isLoading: true,
    data: null,
    error: null,
    snapshot: null,
  };

  componentDidMount() {
    this.setupFirestoreListener(this.props);
  }

  componentWillUnmount() {
    this.handleUnsubscribe();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.path !== this.props.path) {
      this.handleUnsubscribe();

      this.setState({ isLoading: true }, () =>
        this.setupFirestoreListener(this.props),
      );
    }
  }

  handleUnsubscribe() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  setupFirestoreListener = props => {
    const { firestoreDatabase } = this.context;
    const { path } = props;
    const documentRef = firestoreDatabase.doc(path);

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
      this.setState({
        isLoading: false,
        data: {
          id: snapshot.id,
          ...snapshot.data(),
        },
        error: null,
        snapshot,
      });
    }
  };

  render() {
    const { children, render } = this.props;

    if (render) return render(this.state);

    if (typeof children === 'function') return children(this.state);

    return null;
  }
}

export default FirestoreDocument;
