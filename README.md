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

* [Installation](#installation)
* [Usage](#usage)
  * [FirestoreProvider](#firestoreprovider)
  * [FirestoreCollection](#firestorecollection)
  * [FirestoreDocument](#firestoredocument)

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
  document.getElementById('root')
);
```

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
            <li>
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

##### render

> function({}) | _required_

This is the function where you render whatever you want based on the state of
the `FirebaseCollection` component. The object provided to the `render` function
contains the following fields:

| property  | type       | description                                                                                                                                     |
| --------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| isLoading | boolean    | Loading status for the firebase query. `true` until an initial payload from Firestore is received.                                              |
| data      | Array<any> | An array containing all of the documents in the collection. Each item will contain an `id` along with the other data contained in the document. |

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

| property  | type            | description                                                                                                                                                                                |
| --------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| isLoading | boolean         | Loading status for the firebase query. `true` until an initial payload from Firestore is received.                                                                                         |
| data      | Object / `null` | The document that resides at the given `path`. Will be `null` until an initial payload is received. The document will contain an `id` along with the other data contained in the document. |

[npm]: https://www.npmjs.com/
[yarn]: https://yarnpkg.com/
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
