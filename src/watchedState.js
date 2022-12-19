import onChange from 'on-change';
import i18next from 'i18next';
import state from './state';

// TODO: Состояние приложения задается внутри функции, а не на уровне модуля

// onChange(state, (path, value) => {...}).path = value;
// watchedState.posts = newPosts.concat(state.posts);
// const watchedState = onChange(state, render(???))

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
  if (path === 'posts') {
    const postsDisplay = document.getElementById('posts');
    postsDisplay.innerText = '';

    state.posts.forEach((post) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      if (state.viewedPosts.indexOf(post.postID) !== -1) {
        link.classList.add('fw-normal');
      } else {
        link.classList.add('fw-bold');
      }
      link.innerHTML = post.title;
      link.setAttribute('href', post.link);
      link.setAttribute('postID', post.postID);
      li.append(link);

      const button = document.createElement('button');
      button.classList.add('btn', 'btn-primary', 'modal-show-button');
      button.setAttribute('type', 'button');
      button.setAttribute('data-bs-toggle', 'modal');
      button.setAttribute('data-bs-target', '#exampleModal');
      button.setAttribute('postID', post.postID);
      button.innerHTML = i18next.t('viewBtn');
      li.append(button);

      postsDisplay.append(li);
    });
  }
  if (path === 'viewedPosts') {
    const currentLink = document.querySelector(`a[postid='${value[value.length - 1]}']`);
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
    const requiredPost = state.posts.filter((post) => post.postID === Number(value));
    readCompletelyButton.post(0).setAttribute('href', requiredPost[0].link);
    modalTitle.post(0).innerText = requiredPost[0].title;
    modalDescription.post(0).innerText = requiredPost[0].description;
  }
});
