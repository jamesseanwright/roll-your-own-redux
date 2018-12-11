import * as React from 'react';
import { shallow } from 'enzyme';
import { MessageList } from '../MessageList';

describe('MessageList', () => {
  it('should render the messages passed via props', () => {
    const messages = ['foo', 'bar', 'baz'];
    const rendered = shallow(<MessageList messages={messages} />);

    messages.forEach((message, i) => {
      const messageElement = rendered.childAt(i);
      expect(messageElement.type()).toBe('li');
      expect(messageElement.text()).toBe(message);
    });
  });
});
