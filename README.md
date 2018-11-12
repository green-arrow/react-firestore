[![Build Status][build-badge]][build]
[![codecov][coverage-badge]][coverage]
[![MIT License][license-badge]][license]
[![version][version-badge]][package]

[![size][size-badge]][unpkg-dist]
[![gzip size][gzip-badge]][unpkg-dist]
[![module formats: umd, cjs, and es][module-formats-badge]][unpkg-dist]

# react-firestore 🔥🏪

React components to fetch collections and documents from Firestore

## The problem

You want to use the new Firestore database from Google, but don't want to
have to use redux or any other state management tool. You would like to not have
to worry too much about the exact API for firestore (snapshots, references, etc),
and just be able to retrieve collections and documents and read their data.

You also want to do all this using [render props, because they're awesome](https://www.youtube.com/watch?v=BcVAq3YFiuc).

## The solution

This is a set of components that allows you to interact with Firestore collections
and documents, without needing to constantly call additional methods (like `.data()`)
to display your data.

There is still an escape hatch where the snapshot from Firestore is provided to
your render function, in the event that you need more control over your interactions
with Firestore.

## Disclaimer

This project is still a work in progress and in an alpha state.
The API may update frequently.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

* [Installation](#installation)
* [Usage](#usage)
  * [`FirestoreProvider`](#firestoreprovider)
  * [`FirestoreCollection`](#firestorecollection)
  * [`FirestoreDocument`](#firestoredocument)
  * [`Firestore`](#firestore)
  * [`withFirestore`](#withfirestore)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This package is available on [npm][npm].

```
npm install --save react-firestore
```

Or, if you're using [yarn][yarn]:

```
yarn add react-firestore
```

## Usage

There are 3 components provided with this package:

* [FirestoreProvider](#firestoreprovider)
* [FirestoreCollection](#firestorecollection)
* [FirestoreDocument](#firestoredocument)

### `FirestoreProvider`

This component allows the `FirestoreCollection` and `FirestoreDocument`
components to communicate with Firestore.

At the top level of your app, configure `firebase` and render the
`FirestoreProvider` component.

If you're using [create-react-app][create-react-app], your `index.js`
file would look something like this:


```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import firebase from '@firebase/app';
import '@firebase/firestore';
import { FirestoreProvider } from 'react-firestore';

import App from './App';

const config = {
  apiKey: '<your_api_key>',
  projectId: '<your_firebase_project_id>',
};

firebase.initializeApp(config);

ReactDOM.render(
  <FirestoreProvider firebase={firebase}>
    <App />
  </FirestoreProvider>,
  document.getElementById('root'),
);
```

_Important: Starting with Firebase v5.5.0 timestamp objects stored in Firestore get returned as Firebase
Timestamp objects instead of regular Date() objects. To make your app compatible with this
change, add the `useTimestampsInSnapshots` to the FirestoreProvider element. If you dont do this
your app might break. For more information visit [the Firebase refrence documentation][https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp]._

_Note: The reason for the separate imports for `@firebase/app` and `@firebase/firestore`
is because `firestore` is not included in the default `firebase` wrapper package. See
the [firestore package](https://www.npmjs.com/package/@firebase/firestore) for more details._

#### `FirestoreProvider` props

##### firebase

> `firebase` | _required_

An already initialized `firebase` object from the [@firebase/app package](https://www.npmjs.com/package/@firebase/app).

### `FirestoreCollection`

This component allows you to interact with a Firestore collection.
Using this component, you can access the collection at a given `path`
and provide sort options, perform queries, and paginate data.

This component will setup a listener and update
whenever the given collection is updated in Firestore.

Example usage to get a collection and sort by some fields:

```jsx
<FirestoreCollection
  path="stories"
  sort="publishedDate:desc,authorName"
  render={({ isLoading, data }) => {
    return isLoading ? (
      <Loading />
    ) : (
      <div>
        <h1>Stories</h1>
        <ul>
          {data.map(story => (
            <li key={story.id}>
              {story.title} - {story.authorName}
            </li>
          ))}
        </ul>
      </div>
    );
  }}
/>
```

#### `FirestoreCollection` props

##### path

> `string` | _required_

The `/` separated path to the Firestore collection. Collections must
contain an odd number of path segments.

##### sort

> `string` | defaults to `null`

A comma-delimited list of fields by which the query should be ordered.
Each item in the list can be of the format `fieldName` or `fieldName:sortOrder`.
The `sortOrder` piece can be either `asc` or `desc`. If just a field name is given,
`sortOrder` defaults to `asc`.

##### limit

> `number` | defaults to `null`

The maximum number of documents to retrieve from the collection.

##### filter

> `array` or `array of array` | defaults to `null`

Passing in an array of strings creates a simple query to filter the collection by

```jsx
<FirestoreCollection
  path={'users'}
  filter={['firstName', '==', 'Mike']}
  render={() => {
    /* render stuff*/
  }}
/>
```

Passing in an array of arrays creates a compound query to filter the collection by

```jsx
<FirestoreCollection
  path={'users'}
  filter={[['firstName', '==', 'Mike'], ['lastName', '==', 'Smith']]}
  render={() => {
    /* render stuff*/
  }}
/>
```

Passing in document references allows you to filter by reference fields:

```jsx
<FirestoreCollection
  path={'users'}
  filter={[
    'organization',
    '==',
    firestore.collection('organizations').doc('foocorp'),
  ]}
  render={() => {
    /* render stuff*/
  }}
/>
```

##### render

> function({}) | _required_

This is the function where you render whatever you want based on the state of
the `FirebaseCollection` component. The object provided to the `render` function
contains the following fields:

| property  | type                     | description                                                                                                                                                                                         |
| --------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| isLoading | `boolean`                | Loading status for the firebase query. `true` until an initial payload from Firestore is received.                                                                                                  |
| error     | `Error`                  | Error received from firebase when the listen fails or is cancelled.                                                                                                                                 |
| data      | `Array<any>`             | An array containing all of the documents in the collection. Each item will contain an `id` along with the other data contained in the document.                                                     |
| snapshot  | `QuerySnapshot` / `null` | The firestore `QuerySnapshot` created to get data for the collection. See [QuerySnapshot docs](https://cloud.google.com/nodejs/docs/reference/firestore/latest/QuerySnapshot) for more information. |

### `FirestoreDocument`

This component allows you to retrieve a Firestore document from the given `path`.

This component will setup a listener and update
whenever the given document is updated in Firestore.

```jsx
<FirestoreDocument
  path="stories/1"
  render={({ isLoading, data }) => {
    return isLoading ? (
      <Loading />
    ) : (
      <div>
        <h1>{data.title}</h1>
        <h2>
          {data.authorName} - {data.publishedDate}
        </h2>
        <p>{data.description}</p>
      </div>
    );
  }}
/>
```

#### `FirestoreDocument` props

##### path

> `string` | _required_

The `/` separated path to the Firestore document.

##### render

> function({}) | _required_

This is the function where you render whatever you want based on the state of
the `FirebaseDocument` component. The object provided to the `render` function
contains the following fields:

| property  | type                        | description                                                                                                                                                                                                |
| --------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| isLoading | `boolean`                   | Loading status for the firebase query. `true` until an initial payload from Firestore is received.                                                                                                         |
| error     | `Error`                     | Error received from firebase when parsing the document data.                                                                                                                                               |
| data      | `Object` / `null`           | The document that resides at the given `path`. Will be `null` until an initial payload is received. The document will contain an `id` along with the other data contained in the document.                 |
| snapshot  | `DocumentSnapshot` / `null` | The firestore `DocumentSnapshot` created to get data for the document. See [DocumentSnapshot docs](https://cloud.google.com/nodejs/docs/reference/firestore/latest/DocumentSnapshot) for more information. |

### `Firestore`

This component supplies the firestore database to the function specified
by the `render` prop. This component can be used if you need more flexibility
than the `FirestoreCollection` and `FirestoreDocument` components provide,
or if you would just rather interact directly with the `firestore` object.

```jsx
<Firestore
  render={({ firestore }) => {
    // Do stuff with `firestore`
    return <div> /* Component markup */ </div>;
  }}
/>
```

#### `Firestore` props

##### render

> function({}) | _required_

This is the function where you render whatever you want using the firestore
object passed in.

| property  | type     | description                                                                                                                                   |
| --------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| firestore | `Object` | The `Firestore` class from [firestore][firestore-package]. See the docs for the [Firestore class][firestore-class-docs] for more information. |

### `withFirestore`

This higher-order component can be used to provide the firestore database
directly to the wrapped component via the `firestore` prop.

```jsx
class MyComponent extends Component {
  state = {
    story: null,
  };

  componentDidMount() {
    const { firestore } = this.props;

    firestore.doc('stories/1').onSnapshot(snapshot => {
      this.setState({ story: snapshot });
    });
  }

  render() {
    const { story } = this.state;
    const storyData = story ? story.data() : null;

    return storyData ? (
      <div>
        <h1>{storyData.title}</h1>
        <h2>
          {storyData.authorName} - {storyData.publishedDate}
        </h2>
        <p>{storyData.description}</p>
      </div>
    ) : (
      <Loading />
    );
  }
}

export default withFirestore(MyComponent);
```

#### `Component.WrappedComponent`

The wrapped component is available as a static property called
`WrappedComponent` on the returned component. This can be used
for testing the component in isolation, without needing to provide
context in your tests.

#### Props for returned component

##### wrappedComponentRef

> function | _optional_

A function that will be passed as the `ref` prop to the wrapped component.

[npm]: https://www.npmjs.com/
[yarn]: https://yarnpkg.com/
[firestore-package]: https://www.npmjs.com/package/@firebase/firestore
[firestore-class-docs]: https://cloud.google.com/nodejs/docs/reference/firestore/0.11.x/Firestore
[create-react-app]: https://github.com/facebookincubator/create-react-app
[build-badge]: https://img.shields.io/travis/green-arrow/react-firestore.svg?style=flat-square
[build]: https://travis-ci.org/green-arrow/react-firestore
[coverage-badge]: https://img.shields.io/codecov/c/github/green-arrow/react-firestore.svg?style=flat-square
[coverage]: https://codecov.io/github/green-arrow/react-firestore
[license-badge]: https://img.shields.io/npm/l/react-firestore.svg?style=flat-square
[license]: https://github.com/green-arrow/react-firestore/blob/master/LICENSE
[version-badge]: https://img.shields.io/npm/v/react-firestore.svg?style=flat-square
[package]: https://www.npmjs.com/package/react-firestore
[gzip-badge]: http://img.badgesize.io/https://unpkg.com/react-firestore/dist/react-firestore.umd.min.js?compression=gzip&label=gzip%20size&style=flat-square
[size-badge]: http://img.badgesize.io/https://unpkg.com/react-firestore/dist/react-firestore.umd.min.js?label=size&style=flat-square
[unpkg-dist]: https://unpkg.com/react-firestore/dist/
[module-formats-badge]: https://img.shields.io/badge/module%20formats-umd%2C%20cjs%2C%20es-green.svg?style=flat-square
