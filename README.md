# Roll Your Own Redux

![Screencap of the app](https://raw.githubusercontent.com/jamesseanwright/roll-your-own-redux/master/misc/screencap.gif)

A proof-of-concept app demonstrating how one can implement Redux with [React Hooks](https://reactjs.org/docs/hooks-intro.html) and the [context API](https://reactjs.org/docs/context.html).

## The App

The app is a straightforward React app that renders user-submitted messages, as well as displaying quotes from the [Ron Swanson Quotes](https://github.com/jamesseanwright/ron-swanson-quotes) API.

## Layout

Given the small size of the codebase, the app's source directory `src` houses four directories:

* `actions` - the action types and action creators dispatched by the app
* `components` - the presentational and connected components, both of which are typically specified together in each module
* `reducers` - contains a sole reducer for computing the next state for a given action
* `state` - type definitions and defaults for our shared state

### The Bindings Module

The bindings module (`bindings.tsx`) effectively reimplements React Redux (`react-redux`), with implementations of:

* the [`Provider` component](https://react-redux.js.org/api#provider)
* the [`connect` function](https://react-redux.js.org/api#connect)

## Missing Features

For simplicity's sake, our implementation takes a few liberties:

* The bindings are built around our own `State` type
* Middleware is not supported. Instead, [thunks](https://github.com/reduxjs/redux-thunk) are supported out of the box
* `Provider` doesn't accept a store prop, instead taking a reducer function directly
* `connect`'s `mergeProps` parameter is not implemented
* Redux's `combineReducers` and React Redux's `connectAdvanced` are missing

## Running Locally

To set up:

1. `git clone https://github.com/jamesseanwright/roll-your-own-redux.git`
2. `cd react-observable-state`
3. `npm i`

Then you can run one of the following commands:

* `npm run dev` - builds the project with [rollup.js](https://rollupjs.org/guide/en) and serves it from port 8080
* `npm test` - runs the unit tests (append ` -- --watch` to launch Jest's watch mode)
