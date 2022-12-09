/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import ru from './ru';
import state from './state';
import parser from './parsers';
import watchedState from './watchedState';

// Спросить про Prettier, Lorem и запрос возвращающий 404
// Спросить про Bootstrap

i18next.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
  },
});

const form = document.getElementById('form');
const inputField = document.getElementById('url-input');
const itemsContainer = document.querySelector('#items');

const validation = (url) => {
  const schema = yup
    .string()
    .required(i18next.t('blankField'))
    .url(i18next.t('invalidUrl'))
    .notOneOf(state.feedsLinks, i18next.t('rssAlreadyExists'));

  return schema.validate(url);
};

const errorHandler = (error) => {
  switch (error.name) {
    case 'ValidationError':
      watchedState.isValid = false;
      watchedState.feedback = error.message;
      break;
    case 'AxiosError':
      watchedState.feedback = i18next.t('axiosError');
      break;
    case 'ParsingError':
      watchedState.feedback = i18next.t('parsingError');
      break;
    default:
      watchedState.feedback = i18next.t('unknownError');
      throw new Error('UnknownError');
  }
};

const itemsRecheck = () => {
  const promises = state.feedsLinks.forEach((feedLink) => {
    axios
      .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${feedLink}`)
      .then((response) => parser(response))
      .then((parsingResult) => {
        const { items } = parsingResult;
        const alreadyAddedItemsTitles = state.items.map((item) => item.title);
        const newItems = items.filter((item) => !alreadyAddedItemsTitles.includes(item.title));
        if (newItems.length === 0) {
          return;
        }

        newItems.forEach((item) => {
          state.itemsCount += 1;
          return { itemID: state.itemsCount, ...item };
        });

        watchedState.items = newItems.concat(state.items);
      })
      .catch((error) => {
        errorHandler(error);
      });
  });
  // Если сломается одна ссылка, то все остальные тоже не будут обновлены?
  // Может имеет смысл, в случае с recheck, при ошибке одного из промисов
  // прекращать выполнение конкретного промиса без throw error?

  const promise = Promise.all(promises);
  promise.finally(setTimeout(itemsRecheck, 5000));
};

const firstItemsRecheck = () => {
  if (state.isRecheckStarted === false) {
    state.isRecheckStarted = true;
    itemsRecheck();
  }
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const url = formData.get('url');

  validation(url)
    .then(() => {
      watchedState.isValid = true;
    })
    .then(() => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`))
    .then((response) => parser(response))
    .then((parsingResult) => {
      const { items } = parsingResult;
      items.forEach((item) => {
        state.itemsCount += 1;
        item.itemID = state.itemsCount;
      });

      watchedState.feeds.push(parsingResult.feed);
      watchedState.items = parsingResult.items.concat(state.items);
      watchedState.feedback = i18next.t('success');
    })
    .then(() => {
      state.feedsLinks.push(url);
      inputField.value = '';
    })
    .then(() => setTimeout(firstItemsRecheck, 5000))
    .catch((error) => {
      errorHandler(error);
    });
});

itemsContainer.addEventListener('click', (e) => {
  const { target } = e;
  if (target.classList.contains('modal-show-button')) {
    const itemID = target.getAttribute('itemID');
    watchedState.modalWindow = itemID;
    if (state.viewedItems.indexOf(itemID) === -1) {
      watchedState.viewedItems.push(Number(itemID));
    }
  }
});
