import * as React from 'react';
import { State } from '../state';
import { isAddMessage, Action, isSetQuoteLoading, isSetQuoteError } from '../actions/actions';

const rootReducer: React.Reducer<State, Action> = (state, action) => {
  if (isAddMessage(action)) {
    const { message } = action.payload;

    return {
      ...state,
      isLoadingQuote: false,
      hasQuoteError: false,
      isFormValid: !!message,
      messages: [
        ...(message ? [message] : []),
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
