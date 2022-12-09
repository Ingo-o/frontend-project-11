import onChange from 'on-change';
import i18next from 'i18next';
import state from './state';

export default onChange(state, (path, value) => {
  if (path === 'isValid') {
    const inputField = document.getElementById('url-input');
    if (value === true) {
      inputField.classList.remove('is-invalid');
    } else {
      inputField.classList.add('is-invalid');
    }
  }
  if (path === 'feeds') {
    const feedsDisplay = document.getElementById('feed');
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
    const itemsDisplay = document.getElementById('items');
    itemsDisplay.innerText = '';

    state.items.forEach((item) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      if (state.viewedItems.indexOf(item.itemID) !== -1) {
        link.classList.add('fw-normal');
      } else {
        link.classList.add('fw-bold');
      }
      link.innerHTML = item.title;
      link.setAttribute('href', item.link);
      link.setAttribute('itemID', item.itemID);
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
  if (path === 'viewedItems') {
    const currentLink = document.querySelector(`a[itemid='${value[value.length - 1]}']`);
    currentLink.classList.remove('fw-bold');
    currentLink.classList.add('fw-normal');
  }
  if (path === 'feedback') {
    const feedback = document.getElementById('feedback');
    feedback.innerText = value;
  }
  if (path === 'modalWindow') {
    const modalTitle = document.getElementsByClassName('modal-title');
    const modalDescription = document.getElementsByClassName('modal-body');
    const readCompletelyButton = document.getElementsByClassName('read-completely-button');
    const requiredItem = state.items.filter((item) => item.itemID === Number(value));
    readCompletelyButton.item(0).setAttribute('href', requiredItem[0].link);
    modalTitle.item(0).innerText = requiredItem[0].title;
    modalDescription.item(0).innerText = requiredItem[0].description;
  }
});
