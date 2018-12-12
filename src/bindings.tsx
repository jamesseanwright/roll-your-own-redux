import * as React from 'react';
import { State, defaultState } from './state';
import { Action } from './actions';

interface ProviderProps {
  defaultState: State; // TODO: mention intentional hard-coding of State type in post
  reducer: React.Reducer<State, Action>;
}

interface Context {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export type Thunk = (dispatch: React.Dispatch<Action>, state: State) => Promise<{} | void> | void;
export type AugmentedDispatch = React.Dispatch<Thunk | Action>;
type MapTo<TArgA, TArgB, TResult> = (a: TArgA, b: TArgB) => TResult;

const defaultDispatch = () => undefined;

const StateContext = React.createContext<Context>({
  state: defaultState,
  dispatch: defaultDispatch,
});

/* Rather than go to the overhead of
 * implementing middleware, we'll abstract
 * dispatch to add thunk support for free
 * TODO: in article, don't augment dispatch initially */
const augmentDispatch = (dispatch: React.Dispatch<Action>, state: State) =>
  (action: Thunk | Action) =>
    action instanceof Function ? action(dispatch, state) : dispatch(action);

export const Provider: React.FC<ProviderProps> = ({ reducer, children }) => {
  const [state, dispatch] = React.useReducer(reducer, defaultState);

  return (
    <StateContext.Provider value={{
      state,
      dispatch: augmentDispatch(dispatch, state),
    }}>
      {children}
    </StateContext.Provider>
  );
};

const withDefault = <TArgA, TArgB, TResult>(mapTo?: MapTo<TArgA, TArgB, TResult>): MapTo<TArgA, TArgB, TResult> =>
  (a: TArgA, b: TArgB) => mapTo ? mapTo(a, b) : {} as TResult;

export const connect = <TStateProps, TDispatchProps = {}, TOwnProps = {}>(
  mapStateToProps: (state: State, ownProps: TOwnProps) => TStateProps,
  mapDispatchToProps?: (dispatch: AugmentedDispatch, ownProps: TOwnProps) => TDispatchProps,
  // For simplicity, we're omitting mergeProps for now
) =>
  (Component: React.ComponentType<TStateProps & TDispatchProps & TOwnProps>) =>
    (props: TOwnProps) =>
      <StateContext.Consumer>
        {({ state, dispatch }) => (
          <Component
            {...props}
            {...mapStateToProps(state, props)}
            {...withDefault(mapDispatchToProps)(dispatch, props)}
          />
        )}
      </StateContext.Consumer>;
