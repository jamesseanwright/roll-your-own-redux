import * as React from 'react';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import Status from './Status';
import { Provider } from '../bindings';
import { defaultState } from '../state';
import rootReducer from '../reducers/rootReducer';

export default () => (
  <Provider
    defaultState={defaultState}
    reducer={rootReducer
  }>
    <Status />
    <MessageForm />
    <MessageList />
  </Provider>
);
