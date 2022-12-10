/* eslint-disable no-param-reassign */
// Спросить про Bootstrap
// Исправить ошибки написанные на HEXLET!
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import ru from './ru';
import state from './state';
import parser from './parsers';
import watchedState from './watchedState'; // watch

// https://ru.hexlet.io/blog/posts/skripty-moduli-i-biblioteki
// https://ru.hexlet.io/courses/js-frontend-architecture/lessons/initialization/theory_unit

export default () => {
  const i18n = i18next.createInstance();

  i18n.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  // const watchedState = watch(elements, initState, i18nextInstance);

  const form = document.getElementById('form');
  const inputField = document.getElementById('url-input');
  const itemsContainer = document.querySelector('#items');

  const validation = (url) => {
    const schema = yup
      .string()
    // TODO: переводы должны применяться только в самом конце, до этого работа должна происходить с ключами (yup.setLocale)
      .required(i18n.t('blankField'))
      .url(i18n.t('invalidUrl'))
      .notOneOf(state.feedsLinks, i18n.t('rssAlreadyExists'));

    return schema.validate(url);
  };

  const errorHandler = (error) => {
    /* if (error.isAxiosError) {
      return 'network';
    }

    if (error.isParsingError) {
      return 'parsing';
    }

    return 'unknown';
    } */

    switch (error.name) {
      case 'ValidationError':
        watchedState.isValid = false;
        // TODO: в состоянии сохраняются только ключи переводов
        watchedState.feedback = error.message;
        break;
        // корректнее привести все в стиль axios, isParsingError и isAxiosError
      case 'AxiosError':
        watchedState.feedback = i18n.t('axiosError'); // network
        break;
      case 'ParsingError':
        watchedState.feedback = i18n.t('parsingError'); // parsing
        break;
      default: // unknown
        watchedState.feedback = 'unknownError';
        throw new Error('UnknownError');
    }
  };

  const itemsRecheck = () => {
    const promises = state.feedsLinks.map((feedLink) => axios
    // TODO: формирование проксированное Url вынести в отдельную функцию,
    // использовать new URL(...) и searchParams
      .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${feedLink}`)
      .then((response) => parser(response))
      .then((parsingResult) => {
        const { items } = parsingResult;
        const alreadyAddedItemsTitles = state.items.map((item) => item.title);
        const newItems = items.filter((item) => !alreadyAddedItemsTitles.includes(item.title));
        if (newItems.length === 0) {
        // Проверить еще раз
          return;
        }

        newItems.forEach((item) => {
          state.itemsCount += 1;
          return { itemID: state.itemsCount, ...item };
        });

        watchedState.items = newItems.concat(state.items);
      })
      .catch((error) => {
        console.error(error);
      // errorHandler(error);
      }));
    // Если сломается одна ссылка, то все остальные тоже не будут обновлены?
    // Может имеет смысл, в случае с recheck, при ошибке одного из промисов
    // прекращать выполнение конкретного промиса без throw error?

    Promise.all(promises).finally(setTimeout(itemsRecheck, 5000));
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
      .then(() => axios.get(
        `https://allorigins.hexlet.app/get?disableCache=true&url=${url}`,
      ))
      .then((response) => parser(response))
      .then((parsingResult) => {
        const { items } = parsingResult;
        items.forEach((item) => {
          state.itemsCount += 1;
          item.itemID = state.itemsCount;
        });

        watchedState.feeds.push(parsingResult.feed);
        watchedState.items = parsingResult.items.concat(state.items);
        watchedState.feedback = i18n.t('success');
      })
      .then(() => {
        state.feedsLinks.push(url);
        inputField.value = '';
      })
      .then(() => setTimeout(firstItemsRecheck, 5000)) // Перепроверить
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
};

// setTimeout(() => itemsRecheck(watchedState), 5000);
