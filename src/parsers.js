const parser = (incomingData) => {
  const newParser = new DOMParser();
  const data = newParser.parseFromString(incomingData.data.contents, 'text/xml');
  const errorNode = data.querySelector('parsererror');
  if (errorNode) {
    const parsingError = new Error();
    parsingError.isParsingError = true;
    throw parsingError;
  } else {
    const feed = {
      title: data.querySelector('title').textContent,
      description: data.querySelector('description').textContent ? data.querySelector('description').textContent : '',
      link: data.querySelector('link').textContent,
    };

    const posts = Array.from(data.querySelectorAll('item')).map((post) => ({
      title: post.querySelector('title').textContent,
      description: post.querySelector('description').textContent ? post.querySelector('description').textContent : '',
      link: post.querySelector('link').textContent,
    }));

    return { feed, posts };
  }
};

export default parser;
