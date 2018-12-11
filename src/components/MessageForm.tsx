import * as React from 'react';
import { connect, AugmentedDispatch } from '../bindings';
import { State } from '../state';
import { addMessage, addRonSwansonQuote } from '../actions';

type StateProps = Pick<State, 'isFormValid' | 'hasQuoteError' | 'isLoadingQuote'>;

interface DispatchProps {
  addMessage(message: string): void;
  addRonSwansonQuote(): AugmentedDispatch;
}

export const MessageForm: React.FC<StateProps & DispatchProps> =
  ({ isFormValid, hasQuoteError, isLoadingQuote, addMessage, addRonSwansonQuote }) => {
    const [message, setMessage] = React.useState('');

    return (
      <section>
        <h2>Add a Message</h2>

        <form
          name="message-form"
          onSubmit={e => {
            e.preventDefault();
            addMessage(message);
          }}
        >
          <input
            className="form-input"
            type="text"
            name="message"
            placeholder="Your comment"
            onChange={e => setMessage(e.currentTarget.value)}
          />
          <input
            className="form-input form-button"
            type="submit"
            value="Add"
          />
          <button
            className="form-input form-button"
            type="button"
            name="add-quote"
            disabled={isLoadingQuote}
            onClick={() => addRonSwansonQuote()}
          >
            Add Ron Swanson quote
          </button>
        </form>

        {!isFormValid && <p className="form-invalid-message">Please enter a message!</p>}
        {hasQuoteError && <p className="quote-failure-message">Unable to retrieve Ron Swanson quote!</p>}
      </section>
    );
  };

const mapStateToProps = ({ isFormValid, hasQuoteError }: StateProps) => ({
  isFormValid,
  hasQuoteError,
});

const mapDispatchToProps = (dispatch: AugmentedDispatch) => ({
  addMessage: (message: string) => dispatch(addMessage(message)),
  addRonSwansonQuote: () => dispatch(addRonSwansonQuote()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MessageForm);
