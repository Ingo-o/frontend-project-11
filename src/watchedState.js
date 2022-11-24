import onChange from 'on-change';
import i18next from 'i18next';
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
      link.classList.add('link', 'fw-bold');
      link.innerHTML = item.title;
      link.setAttribute('href', item.link);
      li.append(link);

      const button = document.createElement('button');
      button.classList.add('btn', 'btn-primary', 'modal-show-button');
      button.setAttribute('type', 'button');
      button.setAttribute('data-bs-toggle', 'modal');
      button.setAttribute('data-bs-target', '#exampleModal');
      button.setAttribute('itemID', item.itemID);
      button.innerHTML = i18next.t('viewBtn');
      li.append(button);

      itemsDisplay.append(li);
    });
  }
});
