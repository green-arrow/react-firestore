import { Component } from 'react';
import PropTypes from 'prop-types';
import withFirestore from './withFirestore';
import deepEqual from './utils/deepEqual';

class FirestoreCollection extends Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
    sort: PropTypes.string,
    limit: PropTypes.number,
    filter: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
          PropTypes.object,
        ]),
      ),
      PropTypes.arrayOf(PropTypes.array),
    ]),
    children: PropTypes.func,
    render: PropTypes.func,
    firestore: PropTypes.object.isRequired,
  };

  state = {
    isLoading: true,
    data: [],
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
    if (
      nextProps.path !== this.props.path ||
      nextProps.sort !== this.props.sort ||
      nextProps.limit !== this.props.limit ||
      !deepEqual(nextProps.filter, this.props.filter)
    ) {
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
    const { firestore, path, ...queryProps } = this.props;
    const collectionRef = firestore.collection(path);
    const query = this.buildQuery(collectionRef, queryProps);

    this.unsubscribe = query.onSnapshot(
      this.handleOnSnapshotSuccess,
      this.handleOnSnapshotError,
    );
  };

  handleOnSnapshotSuccess = snapshot => {
    if (snapshot) {
      this.setState({
        isLoading: false,
        data: snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })),
        error: null,
        snapshot,
      });
    }
  };

  handleOnSnapshotError = error => {
    this.setState({
      isLoading: false,
      data: [],
      error,
      snapshot: null,
    });
  };

  buildQuery = (collectionRef, queryProps) => {
    const { sort, limit, filter } = queryProps;
    let query = collectionRef;

    if (sort) {
      sort.split(',').forEach(sortItem => {
        const [field, order] = sortItem.split(':');

        query = query.orderBy(field, order);
      });
    }

    if (limit) {
      query = query.limit(limit);
    }

    if (filter) {
      //if filter is array of array, build the compound query
      if (Array.isArray(filter[0])) {
        filter.forEach(clause => {
          query = query.where(...clause);
        });
      } else {
        //build the simple query
        query = query.where(...filter);
      }
    }

    return query;
  };

  render() {
    const { children, render } = this.props;

    if (render) return render(this.state);

    if (typeof children === 'function') return children(this.state);

    return null;
  }
}

export default withFirestore(FirestoreCollection);
