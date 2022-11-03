import 'bootstrap';
import onChange from 'on-change';

// form validation
const form = document.getElementById('form');

const formState = {
  state: null,
  data: null,
  previous: [],
};

const watchedState = onChange(formState, (path, value) => {
  if (path === 'data') {
    console.log(value);
  }
});

form.addEventListener('change', (e) => {
  watchedState.data = e.target.value;
});
