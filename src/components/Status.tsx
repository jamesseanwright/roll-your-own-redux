import * as React from 'react';
import { connect } from '../bindings';
import { State } from '../state';

export const Status = ({ messages }: Pick<State, 'messages'>) => (
  <p>{messages.length} {messages.length === 1 ? 'message' : 'messages'}</p>
);

const mapStateToProps = ({ messages }: State) => ({
  messages,
});

export default connect(mapStateToProps)(Status);
