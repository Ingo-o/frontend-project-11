const parser = (incomingData) => {
  try {
    const newParser = new DOMParser();
    const data = newParser.parseFromString(incomingData.data.contents, 'text/xml');

    const feed = {
      title: data.querySelector('title').textContent,
      description: data.querySelector('description').textContent,
      link: data.querySelector('link').textContent,
    };

    const posts = Array.from(data.querySelectorAll('item')).map((post) => ({
      title: post.querySelector('title').textContent,
      description: post.querySelector('description').textContent,
      link: post.querySelector('link').textContent,
    }));

    return { feed, posts };
  } catch (error) {
    const parsingError = new Error();
    parsingError.name = 'ParsingError';
    throw parsingError;
  }
};

export default parser;

// TODO: ошибки парсинга обрабатываются несколько иначе
// https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString#error_handling

// Не работает, так как, парсинг может вернуть результат (не ошибку), но этот результат не будет соответствовать нужному нам
// и парсинг упадет с unknown error. Например, у https://uastend.com/ribbon/feed/ - у item нет description
