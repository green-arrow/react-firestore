import { Component } from 'react';
import PropTypes from 'prop-types';
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
  };

  static contextTypes = {
    firestoreDatabase: PropTypes.object.isRequired,
    firestoreCache: PropTypes.object.isRequired,
  };

  state = {
    isLoading: true,
    data: [],
    snapshot: null,
  };

  componentDidMount() {
    this.setupFirestoreListener(this.props);
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
          snapshot,
        });
      }
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

export default FirestoreCollection;
