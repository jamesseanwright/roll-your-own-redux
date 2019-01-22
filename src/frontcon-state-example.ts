// tslint:disable:no-console

import { Action, createStore } from 'redux';

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
