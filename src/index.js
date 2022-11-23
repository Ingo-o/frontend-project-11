import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import ru from './ru';
import state from './state';
import { feedParser, itemsParser } from './parsers';
import watchedState from './watchedState';

i18next.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
  },
});

const form = document.getElementById('form');

const itemsRecheck = () => {
  /* console.log('itemsRecheck!'); */
  state.feedsLinks.forEach((feedLink) => {
    axios
      .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${feedLink}`)
      .then((response) => itemsParser(response))
      .then((parsingResult) => {
        watchedState.items = state.items.concat(parsingResult);
      })
      .catch((error) => {
        throw error;
      });
  });
  setTimeout(itemsRecheck, 5000);
};

const firstItemsRecheck = () => {
  if (state.isRecheckStarted === false) {
    /* console.log('firstItemsRecheck!'); */
    state.isRecheckStarted = true;
    itemsRecheck();
  }
};

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
    .then(() => {
      axios
        .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${state.inputData}`)
        .then((response) => feedParser(response))
        .then((parsingResult) => {
          watchedState.feeds.push(parsingResult.feed);
          watchedState.items = parsingResult.items.concat(state.items);
          /* console.log(state.feeds); */
          /* console.log(state.items); */
        })
        .then(() => {
          state.feedsLinks.push(state.inputData);
        })
        .then(() => setTimeout(firstItemsRecheck, 5000))
        .catch((error) => {
          throw error;
        });
    })
    .catch((error) => {
      watchedState.isValid = false;
      throw error;
    });
});

// Писюкатая ссылка: https://worldoftanks.ru/ru/rss/news/
