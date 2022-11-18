import onChange from 'on-change';
import state from './state';

const inputField = document.getElementById('url-input');
const feed = document.getElementById('feed');
const items = document.getElementById('items');

export default onChange(state, (path, value) => {
  if (path === 'isValid') {
    if (value === true) {
      inputField.classList.remove('is-invalid');
      // console.log(state.feedsLinks);
    } else if (value === false) {
      inputField.classList.add('is-invalid');
    }
  }
});
