import { State } from '../state';

export type SetState<TState = State> = (s: TState) => TState;
export type StateHook<TState = State> = [TState, SetState<TState>];
