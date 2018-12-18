import rootReducer from '../rootReducer';
import { addMessage, setQuoteLoading, setQuoteError } from '../../actions';

describe('root reducer', () => {
  it('should reset the loading and error properties and add a message if valid', () => {
    const message = 'hello!';

    const previousState = {
      isLoadingQuote: true,
      hasQuoteError: true,
      isFormValid: false,
      messages: [
        'foo',
      ],
    };

    const expectedState = {
      isLoadingQuote: false,
      hasQuoteError: false,
      isFormValid: true,
      messages: [
        message,
        'foo',
      ],
    };

    const actualState = rootReducer(previousState, addMessage(message));

    expect(actualState).toEqual(expectedState);
  });

  it('should progress to the invalid state if the message is falsy', () => {
    const previousState = {
      isLoadingQuote: true,
      hasQuoteError: true,
      isFormValid: true,
      messages: [
        'foo',
      ],
    };

    const expectedState = {
      isLoadingQuote: false,
      hasQuoteError: false,
      isFormValid: false,
      messages: [
        'foo',
      ],
    };

    const actualState = rootReducer(previousState, addMessage(''));

    expect(actualState).toEqual(expectedState);
  });

  it('should progress to the loading state when it receives a loading action', () => {
    const previousState = {
      isLoadingQuote: false,
      hasQuoteError: true,
      isFormValid: true,
      messages: [
        'foo',
      ],
    };

    const expectedState = {
      isLoadingQuote: true,
      hasQuoteError: false,
      isFormValid: true,
      messages: [
        'foo',
      ],
    };

    const actualState = rootReducer(previousState, setQuoteLoading());

    expect(actualState).toEqual(expectedState);
  });

  it('should progress to the error state when it receives an error action', () => {
    const previousState = {
      isLoadingQuote: true,
      hasQuoteError: false,
      isFormValid: true,
      messages: [
        'foo',
      ],
    };

    const expectedState = {
      isLoadingQuote: false,
      hasQuoteError: true,
      isFormValid: true,
      messages: [
        'foo',
      ],
    };

    const actualState = rootReducer(previousState, setQuoteError());

    expect(actualState).toEqual(expectedState);
  });
});
