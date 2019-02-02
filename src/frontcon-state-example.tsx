// tslint:disable:no-console

import { Action, createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface State {
  message: string;
}

interface MessageAction extends Action<'SET_MESSAGE'> {
  message: string;
}

const reducer = (state: State, { type, message }: MessageAction) => ({
  ...state,
  message: type === 'SET_MESSAGE'
    ? message
    : state.message,
});

const store = createStore<State, MessageAction, {}, {}>(reducer);

store.subscribe(() => {
  console.log('Message changed to', store.getState().message);
});

store.dispatch({
  type: 'SET_MESSAGE',
  message: 'Hello FrontCon!',
});

interface ConnectedProps {
  message: string;
  hasMessage: boolean;
}

const Message = ({ hasMessage, message }: ConnectedProps) =>
  hasMessage && <p>{message}</p>;

const mapStateToProps = ({ message }: State) => ({
  message,
  hasMessage: Boolean(message),
});

const ConnectedMessage = connect(mapStateToProps)(Message);

const App = () => (
  <Provider store={store}>
    <ConnectedMessage />
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('#app'));
