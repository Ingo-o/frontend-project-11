// import 'bootstrap';
import * as yup from 'yup';
import state from './state';
import watchedState from './watchedState';

const form = document.getElementById('form');

form.addEventListener('change', (e) => {
  state.inputData = e.target.value;
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const schema = yup.string().required().url().notOneOf(state.feeds);

  schema
    .validate(state.inputData)
    .then(() => {
      watchedState.isValid = true;
      state.feeds.push(state.inputData);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error);
      watchedState.isValid = false;
    });
});
