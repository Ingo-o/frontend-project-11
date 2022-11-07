import * as yup from 'yup';
import i18next from 'i18next';
import ru from './ru';
import state from './state';
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
    .notOneOf(state.feeds, i18next.t('verificationErrors.notOneOf'));

  schema
    .validate(state.inputData)
    .then(() => {
      watchedState.isValid = true;
      state.feeds.push(state.inputData);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error);
      watchedState.isValid = false;
    });
});
