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
    .required(i18next.t('verificationErrors.required'))
    .url(i18next.t('verificationErrors.url'))
    .notOneOf(state.feedsLinks, i18next.t('verificationErrors.notOneOf'));

  schema
    .validate(state.inputData)
    .then(() => {
      watchedState.isValid = true;
    })
    .then(() => {
      axios
        .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${state.inputData}`)
        .then((response) => parser(response))
        .then((parsingResult) => {
          state.feeds.push(parsingResult.feed);
          parsingResult.items.forEach((item) => state.items.push(item));
        });
    })
    .then(() => state.feedsLinks.push(state.inputData))
    .catch((error) => {
      console.log(error);
      watchedState.isValid = false;
    });

  console.log(state.feeds);
  console.log(state.items);
});
