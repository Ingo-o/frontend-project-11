/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import lodash from 'lodash';
import 'bootstrap';
import ru from './locales/ru';
import state from './state';
import parseRSS from './parser';
import watch from './watchedState';

export default () => {
  const i18n = i18next.createInstance();

  const elements = {
    form: document.getElementById('form'),
    inputField: document.getElementById('url-input'),
    submitButton: document.getElementById('submit-btn'),
    feedsDisplay: document.getElementById('feeds'),
    postsDisplay: document.getElementById('posts'),
    feedback: document.getElementById('feedback'),
    modalTitle: document.getElementById('exampleModalLabel'),
    modalDescription: document.getElementById('modalBody'),
    readCompletelyButton: document.getElementById('readCompletelyButton'),
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

    const validateUrl = (url, links) => {
      const schema = yup
        .string()
        .required()
        .url()
        .notOneOf(links);

      return schema.validate(url);
    };

    const errorHandler = (error) => {
      if (error.message.isValidationError) {
        watchedState.form = { isValid: false, error: error.message.key };
      } else if (error.isAxiosError) {
        watchedState.loadingProcess = { status: 'failed', error: 'axiosError' };
      } else if (error.isParsingError) {
        watchedState.loadingProcess = { status: 'failed', error: 'parsingError' };
      } else {
        watchedState.loadingProcess = { status: 'failed', error: 'unknownError' };
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
      const promises = state.feeds.map((feed) => axios
        .get(constructUrl(feed.link))
        .then((response) => parseRSS(response))
        .then((parsingResult) => {
          const { posts } = parsingResult;
          const newPosts = lodash
            .differenceWith(posts, state.posts, (p1, p2) => p1.title === p2.title)
            .map((post) => {
              post.postID = lodash.uniqueId();
              post.feedID = feed.link;
              return post;
            });

          watchedState.posts.unshift(...newPosts);
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
      const alreadyAddedLinks = state.feeds.map((feed) => feed.link);

      validateUrl(url, alreadyAddedLinks)
        .then(() => {
          watchedState.form = { isValid: true, error: null };
        })
        .then(() => {
          watchedState.loadingProcess = { status: 'loading' };
          return axios.get(constructUrl(url));
        })
        .then((response) => parseRSS(response))
        .then((parsingResult) => {
          const { feed, posts } = parsingResult;
          feed.feedID = url;
          feed.link = url;
          const newPosts = posts.map((post) => {
            post.postID = lodash.uniqueId();
            post.feedID = url;
            return post;
          });

          watchedState.feeds.push(parsingResult.feed);
          watchedState.posts = newPosts.concat(state.posts);
          watchedState.loadingProcess = { status: 'idle', error: null };
        })
        .catch((error) => {
          errorHandler(error);
        });
    });

    setTimeout(postsRecheck, 5000);

    elements.postsDisplay.addEventListener('click', (e) => {
      const { target } = e;
      const postID = target.getAttribute('postID');
      watchedState.modalWindow = postID;
      watchedState.viewedPosts.add(postID);
    });
  });
};
