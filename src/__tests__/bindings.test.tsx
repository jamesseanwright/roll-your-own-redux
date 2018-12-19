import * as React from 'react';
import { mount } from 'enzyme';
import { Provider, connect, Reducer } from '../bindings';
import { Action } from '../actions/actions';
import { State, defaultState } from '../state';
import { DispatchProps } from '../components/MessageForm';

interface OwnProps {
  baz: string;
}

interface StateProps {
  hasMessages: boolean;
  hasBaz: boolean;
}

interface DispatchProps {
  setBaz(): void;
}

const MyComponent: React.FC<OwnProps> = ({ baz }) =>
  <div>{baz}</div>;

// TODO: explain why injecting useReducer
describe('bindings', () => {
  describe('Provider with connect', () => {
    it('should pass any outer props to the connected component', () => {
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

      const renderedRoot = mount(<Root />);
      const renderedChild = renderedRoot.find(ConnectedComponent);

      expect(renderedChild.prop('baz')).toBe('qux');
    });

    it('should pass the props returned by mapStateToProps and mapDispatchToProps to the wrapped components', () => {
      const state = {
        ...defaultState,
        messages: [
          'foo!',
        ],
      };

      const setBaz = () => undefined;
      const reducer = (s: State, a: Action) => s;
      const dispatch = (action: Action) => undefined;
      const useReducer = (r: Reducer, s: State) => [state, dispatch] as [State, React.Dispatch<Action>];

      const mapStateToProps = (state: State, ownProps: OwnProps): StateProps => ({
        hasMessages: !!state.messages.length,
        hasBaz: !!ownProps.baz,
      });

      const mapDispatchToProps = (dispatch: React.Dispatch<Action>, ownProps: OwnProps): DispatchProps => ({
        setBaz,
      });

      const ConnectedComponent = connect<StateProps, DispatchProps, OwnProps>(
        mapStateToProps,
        mapDispatchToProps,
      )(MyComponent);

      const Root = () => (
        <Provider
          defaultState={defaultState}
          reducer={reducer}
          useReducer={useReducer}
        >
          <ConnectedComponent baz="qux" />
        </Provider>
      );

      const renderedRoot = mount(<Root />);
      const renderedChild = renderedRoot.find(MyComponent);

      expect(renderedChild.prop('baz')).toBe('qux');
      expect(renderedChild.prop('hasMessages')).toBe(true);
      expect(renderedChild.prop('hasBaz')).toBe(true);
      expect(renderedChild.prop('setBaz')).toBe(setBaz);
    });
  });
});
