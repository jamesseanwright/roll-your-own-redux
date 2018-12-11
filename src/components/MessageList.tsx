import * as React from 'react';
import { State } from '../state';
import { connect } from '../bindings';

type StateProps = Pick<State, 'messages'>;

export const MessageList = ({ messages }: StateProps) => (
  <ul>
    {messages.map((message, i) => <li key={i}>{message}</li>)}
  </ul>
);

const mapStateToProps = ({ messages }: State) => ({
  messages,
});

export default connect(mapStateToProps)(MessageList);
