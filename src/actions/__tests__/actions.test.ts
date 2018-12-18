import {
  ADD_MESSAGE,
  SET_QUOTE_ERROR,
  SET_QUOTE_LOADING,
  isAddMessage,
  isSetQuoteError,
  isSetQuoteLoading,
  addRonSwansonQuote,
  addMessage,
  setQuoteLoading,
  setQuoteError,
} from '../actions';

describe('actions', () => {
  describe('isAddMessage', () => {
    it('should return true when the action type is ADD_MESSAGE', () => {
      expect(isAddMessage(addMessage(''))).toBe(true);
    });

    it('should return false when the action type is not ADD_MESSAGE', () => {
      expect(isAddMessage(setQuoteLoading())).toBe(false);
    });
  });

  describe('isSetQuoteLoading', () => {
    it('should return true when the action type is SET_QUOTE_LOADING', () => {
      expect(isSetQuoteLoading(setQuoteLoading())).toBe(true);
    });

    it('should return false when the action type is not SET_QUOTE_LOADING', () => {
      expect(isSetQuoteLoading(addMessage(''))).toBe(false);
    });
  });

  describe('isSetQuoteError', () => {
    it('should return true when the action type is SET_QUOTE_ERROR', () => {
      expect(isSetQuoteError(setQuoteError())).toBe(true);
    });

    it('should return false when the action type is not SET_QUOTE_ERROR', () => {
      expect(isSetQuoteError(addMessage(''))).toBe(false);
    });
  });

  describe('addRonSwansonQuote', () => {
    it('should dispatch the quote loading and add message actions when the fetch succeeds', async () => {
      const quote = 'Friends: one to three is sufficient.';

      const fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          json: () => [quote],
        }),
      );

      const dispatch = jest.fn();
      const thunk = addRonSwansonQuote(fetch);

      await thunk(dispatch);

      expect(dispatch.mock.calls).toEqual([
        [setQuoteLoading()],
        [addMessage(quote)],
      ]);
    });

    it('should dispatch the quote loading and quote error actions when the fetch fails', async () => {
      const fetch = jest.fn().mockImplementation(() =>
        Promise.reject(new Error('no')),
      );

      const dispatch = jest.fn();
      const thunk = addRonSwansonQuote(fetch);

      try {
        await thunk(dispatch);
        throw new Error('Expected thunk to reject');
      } catch {
        expect(dispatch.mock.calls).toEqual([
          [setQuoteLoading()],
          [setQuoteError()],
        ]);
      }
    });
  });
});
