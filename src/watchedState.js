/* eslint-disable no-param-reassign */
import onChange from 'on-change';

const handleForm = (state, elements, i18n) => {
  if (state.form.error) {
    elements.feedback.innerText = i18n.t(state.form.error);
  }

  if (state.form.isValid) {
    elements.inputField.classList.remove('is-invalid');
  } else {
    elements.inputField.classList.add('is-invalid');
  }
};

const handleLoadingProcess = (state, elements, i18n) => {
  if (state.loadingProcess.error) {
    elements.feedback.innerText = i18n.t(state.loadingProcess.error);
  }

  if (state.loadingProcess.status === 'idle') {
    elements.inputField.value = '';
    elements.feedback.innerText = i18n.t('success');
    elements.inputField.classList.remove('is-invalid');
    elements.inputField.disabled = false;
    elements.submitButton.disabled = false;
  } else if (state.loadingProcess.status === 'loading') {
    elements.inputField.disabled = true;
    elements.submitButton.disabled = true;
  } else if (state.loadingProcess.status === 'failed') {
    elements.inputField.classList.add('is-invalid');
    elements.inputField.disabled = false;
    elements.submitButton.disabled = false;
  }
};

const handleFeeds = (state, elements) => {
  elements.feedsDisplay.innerHTML = '';
  const fragment = new DocumentFragment();

  state.feeds.forEach((feed) => {
    const title = document.createElement('h1');
    title.classList.add('title');
    title.innerHTML = feed.title;

    const description = document.createElement('div');
    description.classList.add('description');
    description.innerHTML = feed.description;

    const feedContainer = document.createElement('div');
    feedContainer.append(title);
    feedContainer.append(description);

    fragment.prepend(feedContainer);
  });

  elements.feedsDisplay.append(fragment);
};

const handlePosts = (state, elements, i18n) => {
  elements.postsDisplay.innerHTML = '';

  state.posts.forEach((post) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    if (state.viewedPosts.has(post.postID)) {
      link.classList.add('fw-normal');
    } else {
      link.classList.add('fw-bold');
    }
    link.innerHTML = post.title;
    link.setAttribute('href', post.link);
    link.setAttribute('postID', post.postID);
    link.setAttribute('target', '_blank');
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
};

const handleModalWindow = (state, elements) => {
  const requiredPost = state.posts.find((post) => post.postID === state.modalWindow);
  elements.readCompletelyButton.setAttribute('href', requiredPost.link);
  elements.modalTitle.innerText = requiredPost.title;
  elements.modalDescription.innerText = requiredPost.description;
};

export default (state, elements, i18n) => {
  // eslint-disable-next-line consistent-return
  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'form': return handleForm(state, elements, i18n);
      case 'feeds': return handleFeeds(state, elements);
      case 'posts': return handlePosts(state, elements, i18n);
      case 'viewedPosts': return handlePosts(state, elements, i18n);
      case 'loadingProcess': return handleLoadingProcess(state, elements, i18n);
      case 'modalWindow': return handleModalWindow(state, elements);
      default:
        break;
    }
  });

  return watchedState;
};
