import 'bootstrap';
import onChange from 'on-change';
import * as yup from 'yup';

// form validation
const form = document.getElementById('form');

const formState = {
  state: null,
  data: null,
};

const feedsState = {
  feeds: [],
};

const schema = yup.string().required().url().notOneOf(feedsState.feeds);

/* const validate = (data) => {
  try {
    schema.validateSync(data);
    return {};
  } catch (e) {
    return keyBy(e.inner, 'path');
  }
}; */

const watchedState = onChange(formState, (path, value) => {
  /* if (path === 'data') {
    console.log(value);
  } */
});

form.addEventListener('change', (e) => {
  watchedState.data = e.target.value;
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  try {
    schema.validateSync(formState.data);
    formState.state = 'valid';
    alert(formState.state);
    return {};
  } catch (e) {
    formState.state = 'invalid';
    alert(formState.state);
    return e;
  }
});
