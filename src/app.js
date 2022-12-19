/* eslint-disable no-param-reassign */
// Спросить про Bootstrap
// Кнопка - undefined
// Исправить ошибки написанные на HEXLET!
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import ru from './locales/ru';
import state from './state';
import parser from './parsers';
import watchedState from './watchedState';

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

  const form = document.getElementById('form');
  const inputField = document.getElementById('url-input');
  const postsContainer = document.querySelector('#posts');

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
    console.log(error);
    console.log(error.name);
    console.log(error.validationError);

    /* if (error.isAxiosError) {
      return 'network';
    }

    if (error.isParsingError) {
      return 'parsing';
    }

    return 'unknown';
    } */

    switch (error.name) {
      // TODO: в состоянии сохраняются только ключи переводов (???)
      case 'ValidationError':
        watchedState.isValid = false;
        watchedState.feedback = error.message;
        break;
        // Корректнее привести все в стиль axios, isParsingError и isAxiosError
        // Каким образом добавить параметр isValidationError в ошибку валидации?
        // Добавлять его так же как в случае с парсером? Не сложно ли?
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

  const constructUrl = (link) => {
    const newUrl = new URL('https://allorigins.hexlet.app/get');
    newUrl.searchParams.set('disableCache', 'true');
    newUrl.searchParams.set('url', link);
    return newUrl;
  };

  const postsRecheck = () => {
    const promises = state.feedsLinks.map((feedLink) => axios
      .get(constructUrl(feedLink))
      .then((response) => parser(response))
      .then((parsingResult) => {
        const { feed, posts } = parsingResult;
        const alreadyAddedPostsTitles = state.posts.map((post) => post.title);
        const newPosts = posts.filter((post) => !alreadyAddedPostsTitles.includes(post.title));
        if (newPosts.length === 0) {
          return;
        }

        newPosts.forEach((post) => {
          state.postsCount += 1;
          post.postID = state.postsCount;
          post.feedID = feed.link;
          return post;
        });

        watchedState.posts = newPosts.concat(state.posts);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      }));

    Promise.all(promises).finally(setTimeout(postsRecheck, 5000));
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const url = formData.get('url');

    validation(url)
      .then(() => {
        watchedState.isValid = true;
      })
      .then(() => axios.get(constructUrl(url)))
      .then((response) => parser(response))
      .then((parsingResult) => {
        const { feed, posts } = parsingResult;
        feed.feedID = feed.link;
        posts.forEach((post) => {
          state.postsCount += 1;
          post.postID = state.postsCount;
          post.feedID = feed.link;
        });

        watchedState.feeds.push(parsingResult.feed);
        watchedState.posts = parsingResult.posts.concat(state.posts);
        watchedState.feedback = i18n.t('success');
      })
      .then(() => {
        state.feedsLinks.push(url);
        inputField.value = '';
      })
      .then(() => setTimeout(postsRecheck, 5000))
      .catch((error) => {
        errorHandler(error);
      });
  });

  postsContainer.addEventListener('click', (e) => {
    const { target } = e;
    if (target.classList.contains('modal-show-button')) {
      const postID = target.getAttribute('postID');
      watchedState.modalWindow = postID;
      if (state.viewedPosts.indexOf(postID) === -1) {
        watchedState.viewedPosts.push(Number(postID));
      }
    }
  });
};
