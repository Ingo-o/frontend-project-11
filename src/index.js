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
const feedsDisplay = document.getElementById('feed');
const itemsDisplay = document.getElementById('items');

const reCheck = () => {
  // eslint-disable-next-line no-console
  console.log('reCheck!');
  state.feedsCount = 0;
  state.itemsCount = 0;
  state.feeds = [];
  state.items = [];
  feedsDisplay.textContent = '';
  itemsDisplay.textContent = '';
  state.feedsLinks.forEach((feedLink) => {
    axios
      .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${feedLink}`)
      .then((response) => parser(response))
      .then((parsingResult) => {
        watchedState.feeds.push(parsingResult.feed);
        watchedState.items = state.items.concat(parsingResult.items);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  });
  setTimeout(reCheck, 5000);
};

const firstReCheck = () => {
  if (state.isRecheckRunning === false) {
    // eslint-disable-next-line no-console
    console.log('firstReCheck!');
    state.isRecheckRunning = true;
    reCheck();
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
        .then((response) => parser(response))
        .then((parsingResult) => {
          watchedState.feeds.push(parsingResult.feed);
          watchedState.items = state.items.concat(parsingResult.items);
        })
        .then(() => {
          state.feedsLinks.push(state.inputData);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
    })
    .then(() => setTimeout(firstReCheck, 5000))
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error);
      watchedState.isValid = false;
    });

  // console.log(state.feeds);
  // console.log(state.items);
});

// error:
// https://worldoftanks.ru/ru/rss/news/
