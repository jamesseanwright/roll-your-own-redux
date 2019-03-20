import * as React from 'react';
import { mount } from 'enzyme';
import { Provider, connect, Reducer, AugmentedDispatch } from '../bindings';
import { Action } from '../actions/actions';
import { State, defaultState } from '../state';

interface OwnProps {
  baz: string;
  onAsyncBazComplete?(): void;
}

interface StateProps {
  hasMessages: boolean;
  hasBaz: boolean;
}

interface DispatchProps {
  setBaz?(baz: boolean): void;
  setBazAsync?(baz: boolean): void;
}

const bazNoOp = () => undefined;

const createSetBazAction = (payload: boolean) => ({
  type: 'SET_BAZ',
  payload,
});

const MyComponent: React.FC<StateProps & DispatchProps & OwnProps> = ({ baz, setBaz, setBazAsync }) =>
  <button onClick={() => (setBaz || setBazAsync || bazNoOp)(true)}>{baz}</button>;

/* Despite React.useReducer being an implementation detail,
 * React-Test-Renderer and Enzyme don't have full Hook support,
 * thus I'm injecting stubs and placing assertions upon them.
 * TODO: remove stubs and query props for updates when
 * /airbnb/enzyme/pull/2041 is merged and released. */
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

    it('should invoke the dispatch when a dispatch prop is called', () => {
      const reducer = (s: State, a: Action) => s;
      const dispatch = jest.fn();
      const useReducer = (r: Reducer, s: State) => [defaultState, dispatch] as [State, React.Dispatch<Action>];

      const mapStateToProps = (state: State, ownProps: OwnProps): StateProps => ({
        hasMessages: !!state.messages.length,
        hasBaz: !!ownProps.baz,
      });

      const mapDispatchToProps = (dispatch: React.Dispatch<Action<boolean>>, ownProps: OwnProps): DispatchProps => ({
        setBaz(baz) {
          dispatch(createSetBazAction(baz));
        },
      });

      const ConnectedComponent = connect<{}, DispatchProps, OwnProps>(
        undefined,
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
      const renderedChild = renderedRoot.find('button');

      renderedChild.simulate('click');

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(createSetBazAction(true));
    });

    it('should augment the passed dispatch to support thunks', () => {
      const reducer = (s: State, a: Action) => s;
      const dispatch = jest.fn();
      const useReducer = (r: Reducer, s: State) => [defaultState, dispatch] as [State, React.Dispatch<Action>];

      const setBazAsync = (baz: boolean) =>
        (innerDispatch: React.Dispatch<Action>, state: State) => {
          innerDispatch(createSetBazAction(state.hasQuoteError));
          innerDispatch(createSetBazAction(baz));
        };

      const mapDispatchToProps = (dispatch: AugmentedDispatch): DispatchProps => ({
        setBazAsync: (baz: boolean) => {
          dispatch(setBazAsync(baz));
        },
      });

      const ConnectedComponent = connect<{}, DispatchProps, OwnProps>(
        undefined,
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
      const renderedChild = renderedRoot.find('button');

      renderedChild.simulate('click');

      expect(dispatch).toHaveBeenCalledTimes(2);

      expect(dispatch.mock.calls).toEqual([
        [createSetBazAction(false)],
        [createSetBazAction(true)],
      ]);
    });
  });
});
