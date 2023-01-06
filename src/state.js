export default {
  feeds: [],
  posts: [],
  viewedPosts: new Set(),
  modalWindow: null,

  form: {
    isValid: null,
    error: null,
  },

  loadingProcess: {
    status: 'idle',
    error: null,
  },
};
