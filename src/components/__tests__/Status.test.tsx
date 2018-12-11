import * as React from 'react';
import { shallow } from 'enzyme';
import { Status } from '../Status';

describe('Status', () => {
  it('should render the total number of messages', () => {
    const messages = ['foo', 'bar', 'baz'];
    const rendered = shallow(<Status messages={messages} />);

    expect(rendered.text()).toBe('3 messages');
  });

  it('should singularise `messages` when there is just one message in the array', () => {
    const messages = ['foo'];
    const rendered = shallow(<Status messages={messages} />);

    expect(rendered.text()).toBe('1 message');
  });
});
