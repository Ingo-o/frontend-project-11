/* eslint-disable no-param-reassign */
// Спросить про Bootstrap
// Исправить ошибки написанные на HEXLET!
// https://ru.hexlet.io/blog/posts/skripty-moduli-i-biblioteki
// https://ru.hexlet.io/courses/js-frontend-architecture/lessons/initialization/theory_unit
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import ru from './locales/ru';
import state from './state';
import parser from './parsers';
import watch from './watchedState';

export default () => {
  const i18n = i18next.createInstance();

  const elements = {
    form: document.getElementById('form'),
    inputField: document.getElementById('url-input'),
    feedsDisplay: document.getElementById('feed'),
    postsContainer: document.querySelector('#posts'),
    postsDisplay: document.getElementById('posts'),
    feedback: document.getElementById('feedback'),
    modalTitle: document.getElementsByClassName('modal-title'),
    modalDescription: document.getElementsByClassName('modal-body'),
    readCompletelyButton: document.getElementsByClassName('read-completely-button'),
  };

  i18n.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  }).then(() => {
    yup.setLocale({
      string: {
        url: { key: 'invalidUrl', isValidationError: true },
      },
      mixed: {
        required: { key: 'blankField', isValidationError: true },
        notOneOf: { key: 'rssAlreadyExists', isValidationError: true },
      },
    });

    const watchedState = watch(state, elements, i18n);

    const validation = (url) => {
      const schema = yup
        .string()
        .required()
        .url()
        .notOneOf(state.feedsLinks);

      return schema.validate(url);
    };

    const errorHandler = (error) => {
      if (error.message.isValidationError) {
        watchedState.form.isValid = false;
        watchedState.form.error = error.message.key;
      } else if (error.isAxiosError) {
        watchedState.loadingProcess.error = 'axiosError';
      } else if (error.isParsingError) {
        watchedState.loadingProcess.error = 'parsingError';
      } else {
        watchedState.loadingProcess.error = 'unknownError';
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

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(elements.form);
      const url = formData.get('url');

      validation(url)
        .then(() => {
          watchedState.form.isValid = true;
          watchedState.form.error = null;
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
          // watchedState.feedback = 'success';
          elements.inputField.value = ''; // Перенести в watchedState в случае success
          watchedState.loadingProcess.error = null;
        })
        .then(() => {
          state.feedsLinks.push(url);
        })
        .then(() => setTimeout(postsRecheck, 5000))
        .catch((error) => {
          errorHandler(error);
        });
    });

    elements.postsContainer.addEventListener('click', (e) => {
      const { target } = e;
      if (target.classList.contains('modal-show-button')) {
        const postID = target.getAttribute('postID');
        watchedState.modalWindow = postID;
        if (state.viewedPosts.indexOf(postID) === -1) {
          watchedState.viewedPosts.push(Number(postID));
        }
      }
    });
  });
};
