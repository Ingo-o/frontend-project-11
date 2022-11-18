import state from './state';

export default (response) => {
  const parser = new DOMParser();
  const data = parser.parseFromString(response.data.contents, 'application/xml');

  state.feedsCount += 1;
  const feed = {
    feedID: state.feedsCount,
    title: data.querySelector('title').textContent,
    description: data.querySelector('description').textContent,
    link: data.querySelector('link').textContent,
  };

  const items = Array.from(data.querySelectorAll('item')).map((item) => {
    state.itemsCount += 1;
    return {
      feedID: feed.feedID,
      itemID: state.itemsCount,
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    };
  });

  return { feed, items };
};
