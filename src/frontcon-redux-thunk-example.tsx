// tslint:disable:no-console

import { Action, createStore, applyMiddleware, Dispatch } from 'redux';
import { Provider, connect } from 'react-redux';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import reduxThunk, { ThunkDispatch } from 'redux-thunk';

interface State {
  isLoading: boolean;
  hasError: boolean;
  message: string;
}

interface MessageAction extends Action<'SET_MESSAGE'> {
  message: string;
}

const requestMessage = () => ({ type: 'REQUEST_MESSAGE' });
const requestFailure = () => ({ type: 'REQUEST_FAILURE' });

const isActionOfType = <TAction extends Action, TFoo = {}>(action: Action, type: string): action is TAction =>
  action.type === type;

const setMessage = (message: string) => ({
  type: 'SET_MESSAGE',
  message,
});

const isQuotesArray = (res: unknown): res is string[] =>
  Array.isArray(res) && res.every(item => typeof item === 'string');

const parseResponse = (res: unknown) =>
  Array.isArray(res) && res.length > 0 && isQuotesArray(res)
    ? Promise.resolve(res[0])
    : Promise.reject(new Error('Invalid response!'));

const fetchMessage = () =>
  (dispatch: Dispatch<Action>, getState: () => State) => {
    dispatch(requestMessage());

    return fetch('/api/quote')
      .then(res => res.json())
      .then(parseResponse)
      .then(message => dispatch(
        setMessage(message),
      ))
      .catch(() => dispatch(requestFailure()));
  };

const reducer = (state: State, action: Action): State => {
  if (isActionOfType<MessageAction>(action, 'SET_MESSAGE')) {
    return {
      ...state,
      isLoading: false,
      hasError: false,
      message: action.message,
    };
  }

  if (isActionOfType(action, 'REQUEST_MESSAGE')) {
    return {
      ...state,
      isLoading: true,
      hasError: false,
    };
  }

  if (isActionOfType(action, 'REQUEST_FAILURE')) {
    return {
      ...state,
      isLoading: false,
      hasError: true,
    };
  }

  return state;
};

const store = createStore(
  reducer,
  applyMiddleware<ThunkDispatch<{}, {}, Action>, State>(reduxThunk),
);

store.dispatch(fetchMessage());

interface ConnectedProps {
  message: string;
  hasMessage: boolean;
}

const Message = ({ hasMessage, message }: ConnectedProps) =>
  hasMessage ? <p>{message}</p> : null;

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
