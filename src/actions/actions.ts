export interface Action<TPayload = {}> {
  type: string;
  payload: TPayload;
}

interface AddMessagePayload {
  message: string;
}

export const ADD_MESSAGE = 'ADD_MESSAGE';
export const SET_QUOTE_LOADING = 'SET_QUOTE_LOADING';
export const SET_QUOTE_ERROR = 'SET_QUOTE_ERROR';

const createActionTypeGuard = <TPayload>(type: string) =>
  (action: Action<{}>): action is Action<TPayload> =>
    action.type === type;

export const isAddMessage = createActionTypeGuard<AddMessagePayload>(ADD_MESSAGE);
export const isSetQuoteLoading = createActionTypeGuard(SET_QUOTE_LOADING);
export const isSetQuoteError = createActionTypeGuard(SET_QUOTE_ERROR);

const defaultPayload = {};

export const setQuoteLoading = () => ({
  type: SET_QUOTE_LOADING,
  payload: defaultPayload,
});

export const setQuoteError = () => ({
  type: SET_QUOTE_ERROR,
  payload: defaultPayload,
});

export const addMessage = (message: string) => ({
  type: ADD_MESSAGE,
  payload: {
    message,
  },
});

export const addRonSwansonQuote = (fetch = window.fetch) =>
  (dispatch: React.Dispatch<Action>) => {
    dispatch(setQuoteLoading());

    return fetch('https://ron-swanson-quotes.herokuapp.com/v2/quotes')
      .then(res => res.json())
      .then(([quote]: string[]) =>
        dispatch(addMessage(quote)),
      )
      .catch(() => dispatch(setQuoteError()));
  };
