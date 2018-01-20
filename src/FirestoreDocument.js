import { Component } from 'react';
import PropTypes from 'prop-types';

class FirestoreDocument extends Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
    render: PropTypes.func.isRequired,
  };

  static contextTypes = {
    firestoreDatabase: PropTypes.object.isRequired,
    firestoreCache: PropTypes.object.isRequired,
  };

  state = {
    isLoading: true,
    data: null,
    snapshot: null,
  };

  componentDidMount() {
    this.setupFirestoreListener(this.props);
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  setupFirestoreListener = props => {
    const { firestoreDatabase } = this.context;
    const { path } = props;
    const documentRef = firestoreDatabase.doc(path);

    this.unsubscribe = documentRef.onSnapshot(snapshot => {
      if (snapshot) {
        this.setState({
          isLoading: false,
          data: {
            id: snapshot.id,
            ...snapshot.data(),
          },
          snapshot,
        });
      }
    });
  };

  render() {
    const { isLoading, data, snapshot } = this.state;
    const { render } = this.props;

    return render({
      isLoading,
      data,
      snapshot,
    });
  }
}

export default FirestoreDocument;
