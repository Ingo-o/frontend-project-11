import onChange from 'on-change';
import state from './state';

const inputField = document.getElementById('url-input');
const feedsDisplay = document.getElementById('feed');
const itemsDisplay = document.getElementById('items');

export default onChange(state, (path, value) => {
  if (path === 'isValid') {
    if (value === true) {
      inputField.classList.remove('is-invalid');
    } else {
      inputField.classList.add('is-invalid');
    }
  }
  if (path === 'feeds') {
    const lastAddedFeed = state.feeds[state.feeds.length - 1];

    const title = document.createElement('h1');
    title.classList.add('title');
    title.innerHTML = lastAddedFeed.title;

    const description = document.createElement('div');
    description.classList.add('description');
    description.innerHTML = lastAddedFeed.description;

    feedsDisplay.prepend(description);
    feedsDisplay.prepend(title);
  }
  if (path === 'items') {
    itemsDisplay.innerText = '';

    state.items.forEach((item) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.classList.add('link');
      link.innerHTML = item.title;
      link.setAttribute('href', item.link);
      li.prepend(link);
      itemsDisplay.prepend(li);
    });
  }
});
