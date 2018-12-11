import * as React from 'react';
import { State } from '../state';
import { isAddMessage, Action, isSetQuoteLoading, isSetQuoteError } from '../actions';

/* TODO: split and write combineReducers?!*/

const rootReducer: React.Reducer<State, Action> = (state, action) => {
  if (isAddMessage(action)) {
    return {
      ...state,
      isLoadingQuote: false,
      hasQuoteError: false,
      messages: [
        ...state.messages,
        action.payload.message,
      ],
    };
  }

  if (isSetQuoteLoading(action)) {
    return {
      ...state,
      isLoadingQuote: true,
      hasQuoteError: false,
    };
  }

  if (isSetQuoteError(action)) {
    return {
      ...state,
      isLoadingQuote: false,
      hasQuoteError: true,
    };
  }

  return state;
};

export default rootReducer;
