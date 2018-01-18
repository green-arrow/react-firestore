import { Component } from 'react';
import PropTypes from 'prop-types';

class FirestoreCollection extends Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
    sort: PropTypes.string,
    render: PropTypes.func.isRequired,
  };

  static contextTypes = {
    firestoreDatabase: PropTypes.object.isRequired,
    firestoreCache: PropTypes.object.isRequired,
  };

  state = {
    isLoading: true,
    data: [],
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
    const { path, ...queryProps } = props;
    const collectionRef = firestoreDatabase.collection(path);
    const query = this.buildQuery(collectionRef, queryProps);

    this.unsubscribe = query.onSnapshot(snapshot => {
      if (snapshot) {
        this.setState({
          isLoading: false,
          data: snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })),
        });
      }
    });
  };

  buildQuery = (collectionRef, queryProps) => {
    const { sort } = queryProps;
    let query = collectionRef;

    if (sort) {
      sort.split(',').forEach(sortItem => {
        const [field, order] = sortItem.split(':');

        query = query.orderBy(field, order);
      });
    }

    return query;
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

export default FirestoreCollection;
