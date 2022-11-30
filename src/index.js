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
const modalTitle = document.getElementsByClassName('modal-title');
const modalDescription = document.getElementsByClassName('modal-body');
const readCompletelyButton = document.getElementsByClassName('read-completely-button');

const customizeModal = (itemID) => {
  const requiredItem = state.items.filter((item) => item.itemID === Number(itemID));
  readCompletelyButton.item(0).setAttribute('href', requiredItem[0].link);
  modalTitle.item(0).innerText = requiredItem[0].title;
  modalDescription.item(0).innerText = requiredItem[0].description;
  if (state.viewedItems.indexOf(itemID) === -1) {
    watchedState.viewedItems.push(Number(itemID));
  }
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
  state.feedsLinks.forEach((feedLink) => {
    axios
      .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${feedLink}`)
      // eslint-disable-next-line consistent-return
      .then((response) => {
        try {
          return itemsParser(response);
        } catch (error) {
          const parsingError = new Error();
          parsingError.name = 'ParsingError';
          errorHandler(parsingError);
        }
      })
      .then((parsingResult) => {
        watchedState.items = parsingResult.concat(state.items);
      })
      .then(() => {
        const buttons = document.querySelectorAll('button.modal-show-button');
        buttons.forEach((button) => {
          button.addEventListener('click', () => customizeModal(button.getAttribute('itemID')));
        });
      })
      .catch((error) => {
        errorHandler(error);
      });
  });
  setTimeout(itemsRecheck, 5000);
};

const firstItemsRecheck = () => {
  if (state.isRecheckStarted === false) {
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
    .required(i18next.t('blankField'))
    .url(i18next.t('invalidUrl'))
    .notOneOf(state.feedsLinks, i18next.t('rssAlreadyExists'));

  schema
    .validate(state.inputData)
    .then(() => {
      watchedState.isValid = true;
    })
    .then(() => {
      axios
        .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${state.inputData}`)
        // eslint-disable-next-line consistent-return
        .then((response) => {
          try {
            return feedParser(response);
          } catch (error) {
            const parsingError = new Error();
            parsingError.name = 'ParsingError';
            errorHandler(parsingError);
          }
        })
        .then((parsingResult) => {
          watchedState.feeds.push(parsingResult.feed);
          watchedState.items = parsingResult.items.concat(state.items);
          watchedState.feedback = i18next.t('success');
        })
        .then(() => {
          const buttons = document.querySelectorAll('button.modal-show-button');
          buttons.forEach((button) => {
            button.addEventListener('click', () => customizeModal(button.getAttribute('itemID')));
          });
        })
        .then(() => {
          state.feedsLinks.push(state.inputData);
          state.inputData = '';
        })
        .then(() => setTimeout(firstItemsRecheck, 5000));
    })
    .catch((error) => {
      errorHandler(error);
    });
});
