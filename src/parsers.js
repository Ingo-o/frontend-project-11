const parser = (incomingData) => {
  try {
    const newParser = new DOMParser();
    const data = newParser.parseFromString(incomingData.data.contents, 'application/xml');

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
  } catch (error) {
    const parsingError = new Error();
    parsingError.name = 'ParsingError';
    throw parsingError;
  }
};

export default parser;
