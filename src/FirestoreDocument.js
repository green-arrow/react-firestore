import { Component } from 'react';
import PropTypes from 'prop-types';

class FirestoreDocument extends Component {
  state = {
    isLoading: true,
    data: null,
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
    const { path } = this.props;
    const documentRef = firestoreDatabase.doc(path);

    this.unsubscribe = documentRef.onSnapshot(snapshot => {
      if (snapshot) {
        this.setState({
          isLoading: false,
          data: {
            id: snapshot.id,
            ...snapshot.data(),
          },
        });
      }
    });
  };

  render() {
    const { isLoading, data } = this.state;
    const { render } = this.props;

    return render({
      isLoading,
      data,
    });
  }
}

FirestoreDocument.contextTypes = {
  firestoreDatabase: PropTypes.object.isRequired,
  firestoreCache: PropTypes.object.isRequired,
};

export default FirestoreDocument;
