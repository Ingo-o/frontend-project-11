export default {
  feeds: [],
  posts: [],

  isValid: null,
  modalWindow: null,
  feedsLinks: [],
  postsCount: 0,

  viewedPosts: [],
  feedback: null,
};

const temp = {
  form: {
    status: 'filling',
    error: null, // ключ ошибки — невалидный url, уже есть или еще чего
    valid: false,
  },
  modal: {
    postId: null,
  },
  loadingProcess: {
    status: 'idle' || 'loading',
    error: null,
  },
};
