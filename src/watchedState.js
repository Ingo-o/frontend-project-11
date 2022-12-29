/* eslint-disable no-param-reassign */
import onChange from 'on-change';

export default (state, elements, i18n) => {
  const watchedState = onChange(state, (path, value) => {
    if (path === 'form.isValid') {
      if (value === true) {
        elements.inputField.classList.remove('is-invalid');
      } else {
        elements.inputField.classList.add('is-invalid');
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

      elements.feedsDisplay.prepend(description);
      elements.feedsDisplay.prepend(title);
    }
    if (path === 'posts') {
      elements.postsDisplay.innerText = '';

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
        button.innerHTML = i18n.t('viewBtn');
        li.append(button);

        elements.postsDisplay.append(li);
      });
    }
    if (path === 'viewedPosts') {
      const currentLink = document.querySelector(`a[postid='${value[value.length - 1]}']`);
      currentLink.classList.remove('fw-bold');
      currentLink.classList.add('fw-normal');
    }
    if (path === 'form.error' || path === 'loadingProcess.error') {
      elements.feedback.innerText = i18n.t(value);
    }
    if (path === 'modalWindow') {
      const requiredPost = state.posts.filter((post) => post.postID === Number(value));
      elements.readCompletelyButton.item(0).setAttribute('href', requiredPost[0].link);
      elements.modalTitle.item(0).innerText = requiredPost[0].title;
      elements.modalDescription.item(0).innerText = requiredPost[0].description;
    }
  });

  return watchedState;
};
