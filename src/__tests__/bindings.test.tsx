import * as React from 'react';
import { shallow } from 'enzyme';
import { Provider, connect, Reducer } from '../bindings';
import { Action } from '../actions/actions';
import { State, defaultState } from '../state';

interface OwnProps {
  baz: string;
}

const MyComponent: React.FC<OwnProps> = ({ baz }) =>
  <p>{baz}</p>;

// TODO: explain why injecting useReducer
describe('bindings', () => {
  describe('Provider with connect', () => {
    it('should pass any other props to the connected component', () => {
      const reducer = (s: State, a: Action) => s;
      const dispatch = (action: Action) => undefined;
      const useReducer = (r: Reducer, s: State) => [defaultState, dispatch] as [State, React.Dispatch<Action>];
      const ConnectedComponent = connect<{}, {}, OwnProps>()(MyComponent);

      const Root = () => (
        <Provider
          defaultState={defaultState}
          reducer={reducer}
          useReducer={useReducer}
        >
          <ConnectedComponent baz="qux" />
        </Provider>
      );

      const renderedRoot = shallow(<Root />);
      const renderedChild = renderedRoot.find(ConnectedComponent);

      expect(renderedChild.prop('baz')).toBe('qux');
    });
  });
});
