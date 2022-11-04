import onChange from 'on-change';
import state from './state';

const inputField = document.getElementById('inputField');

const watchedState = onChange(state, (path, value) => {
  if (value === true) {
    inputField.classList.remove('is-invalid');
    // eslint-disable-next-line no-console
    console.log(state.feeds);
  } else if (value === false) {
    inputField.classList.add('is-invalid');
  }
});

export default watchedState;
