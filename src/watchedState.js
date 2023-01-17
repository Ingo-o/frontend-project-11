/* eslint-disable no-param-reassign */
import onChange from 'on-change';

const handleForm = (state, elements, i18n) => {
  if (state.form.error) {
    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
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
    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
    elements.feedback.innerText = i18n.t(state.loadingProcess.error);
  }

  if (state.loadingProcess.status === 'idle') {
    elements.inputField.value = '';
    elements.feedback.classList.remove('text-danger');
    elements.feedback.classList.add('text-success');
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

  const feedsCard = document.createElement('div');
  feedsCard.classList.add('card', 'border-0');

  const feedsTitleContainer = document.createElement('div');
  feedsTitleContainer.classList.add('card-body');
  const feedsTitle = document.createElement('h2');
  feedsTitle.classList.add('card-title', 'h4');
  feedsTitle.textContent = 'Фиды';
  feedsTitleContainer.append(feedsTitle);

  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'border-0', 'rounded-0');

  state.feeds.forEach((feed) => {
    const feedContainer = document.createElement('li');
    feedContainer.classList.add('list-group-item', 'border-0', 'border-end-0');
    const title = document.createElement('h3');
    title.classList.add('h6', 'm-0', 'title');
    title.textContent = feed.title;
    const description = document.createElement('p');
    description.classList.add('m-0', 'small', 'text-black-50', 'description');
    description.textContent = feed.description;

    feedContainer.append(title);
    feedContainer.append(description);
    feedsList.append(feedContainer);
  });

  feedsCard.append(feedsTitleContainer);
  feedsCard.append(feedsList);
  elements.feedsDisplay.append(feedsCard);
};

const handlePosts = (state, elements, i18n) => {
  elements.postsDisplay.innerHTML = '';

  const postsCard = document.createElement('div');
  postsCard.classList.add('card', 'border-0');

  const postsTitleContainer = document.createElement('div');
  postsTitleContainer.classList.add('card-body');
  const postsTitle = document.createElement('h2');
  postsTitle.classList.add('card-title', 'h4');
  postsTitle.textContent = 'Посты';
  postsTitleContainer.append(postsTitle);

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounded-0');

  state.posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList
      .add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const link = document.createElement('a');
    if (state.viewedPosts.has(post.postID)) {
      link.classList.add('fw-normal');
      link.classList.add('link-secondary');
    } else {
      link.classList.add('fw-bold');
    }
    link.textContent = post.title;
    link.setAttribute('href', post.link);
    link.setAttribute('postID', post.postID);
    link.setAttribute('target', '_blank');

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('type', 'button');
    button.setAttribute('postID', post.postID);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = i18n.t('viewBtn');

    li.append(link);
    li.append(button);
    postsList.append(li);
  });

  postsCard.append(postsTitleContainer);
  postsCard.append(postsList);
  elements.postsDisplay.append(postsCard);
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
