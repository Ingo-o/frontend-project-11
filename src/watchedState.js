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
    const justAddedFeed = state.feeds.filter((feed) => feed.feedID === state.feedsLinks.length);

    const title = document.createElement('h1');
    title.classList.add('title');
    title.innerHTML = justAddedFeed[0].title;

    const description = document.createElement('div');
    description.classList.add('description');
    description.innerHTML = justAddedFeed[0].description;

    feedsDisplay.prepend(description);
    feedsDisplay.prepend(title);
  }
  if (path === 'items') {
    const justAddedItems = state.items.filter((item) => item.feedID === state.feedsLinks.length);

    justAddedItems.forEach((item) => {
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
