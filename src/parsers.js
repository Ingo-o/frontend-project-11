// TODO: Парсинг чистая функция, на вход данные (строка rss), на выходе объект (не dom!)
// Имена всех свойств (кроме item) должны оставаться такими, какими они были в RSS.
// Парсинг не должен менять структуру. Установка id - не ответственность парсера.

const parser = (incomingData) => {
  try {
    const newParser = new DOMParser();
    const data = newParser.parseFromString(incomingData.data.contents, 'text/xml');
    /* data.querySelector('parseerror') {
         const parsingError = new Error();
         parsingError.isParsingError = true;
         throw ...
    } */

    const feed = {
      feedID: data.querySelector('link').textContent,
      title: data.querySelector('title').textContent,
      description: data.querySelector('description').textContent,
      link: data.querySelector('link').textContent,
    };

    const items = Array.from(data.querySelectorAll('item')).map((item) => ({
      feedID: data.querySelector('link').textContent,
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    }));

    return { feed, items };
    // TODO: ошибки парсинга обрабатываются несколько иначе
    // https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString#error_handling
  } catch (error) {
    const parsingError = new Error();
    parsingError.name = 'ParsingError';
    throw parsingError;
  }
};

export default parser;
