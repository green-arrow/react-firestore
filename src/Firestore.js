import { Component } from 'react';
import PropTypes from 'prop-types';

class Firestore extends Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
  };

  static contextTypes = {
    firestoreDatabase: PropTypes.object.isRequired,
  };

  render() {
    const { firestoreDatabase } = this.context;
    const { render } = this.props;

    return render({ firestore: firestoreDatabase });
  }
}

export default Firestore;
