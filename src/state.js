export default {
  feeds: [],
  posts: [],
  viewedPosts: [],
  feedsLinks: [],
  postsCount: 0,
  feedback: null,

  // form
  isValid: null,

  // modal
  modalWindow: null,
};

const temp = {
  form: {
    status: 'filling', // ready, filling(?), sending (во время sending форма блокируется)
    error: null, // Ключ ошибки. Зачем он нужен?
    valid: false, // isValid(?)
  },

  modal: {
    postId: null, // То же самое что у меня, но выделено в отдельную директорию
  },

  loadingProcess: {
    status: 'idle' || 'loading', // Что нам это дает? Во время loading форма блокируется? А зачем тогда нужен статус формы?
    error: null, // В form были ошибки валидации, а тут ошибки axios? А парсинга?
  },
};

// Правильно ли я понял, что часть из вышеперечисленного, фактически, не нужна в этом проекте, но может пригодится
// при его расширении?
