export interface State {
  messages: string[];
  isFormValid: boolean;
  isLoadingQuote: boolean;
  hasQuoteError: boolean;
}

export const defaultState: State = {
  messages: [],
  isFormValid: true,
  isLoadingQuote: false,
  hasQuoteError: false,
};
