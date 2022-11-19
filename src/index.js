import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import ru from './ru';
import state from './state';
import parser from './parser';
import watchedState from './watchedState';

i18next.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
  },
});

const form = document.getElementById('form');

form.addEventListener('change', (e) => {
  state.inputData = e.target.value;
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const schema = yup
    .string()
    .required(i18next.t('validationErrors.required'))
    .url(i18next.t('validationErrors.url'))
    .notOneOf(state.feedsLinks, i18next.t('validationErrors.notOneOf'));

  schema
    .validate(state.inputData)
    .then(() => {
      watchedState.isValid = true;
    })
    .then(state.feedsLinks.push(state.inputData))
    .then(() => {
      axios
        .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${state.inputData}`)
        .then((response) => parser(response))
        .then((parsingResult) => {
          watchedState.feeds.push(parsingResult.feed);
          watchedState.items = state.items.concat(parsingResult.items);
        }); // http://ports.com/feed/
    })
    .catch((error) => {
      alert(error);
      watchedState.isValid = false;
    });

  /* console.log(state.feeds);
  console.log(state.items); */
});
