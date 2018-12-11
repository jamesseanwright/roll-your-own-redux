import * as React from 'react';
import { State } from '../state';
import { isAddMessage, Action, isSetQuoteLoading, isSetQuoteError } from '../actions';

/* TODO: split and write combineReducers?!*/

const rootReducer: React.Reducer<State, Action> = (state, action) => {
  if (isAddMessage(action)) {
    const { message } = action.payload;

    return {
      ...state,
      isLoadingQuote: false,
      hasQuoteError: false,
      isFormValid: !!message.length,
      messages: [
        ...(message.length ? [message] : []),
        ...state.messages,
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
