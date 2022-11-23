import state from './state';

export const feedParser = (incomingData) => {
  const newParser = new DOMParser();
  const data = newParser.parseFromString(incomingData.data.contents, 'application/xml');

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
      feedID: state.feedsCount,
      itemID: state.itemsCount,
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    };
  });

  return { feed, items };
};

export const itemsParser = (incomingData) => {
  const newParser = new DOMParser();
  const data = newParser.parseFromString(incomingData.data.contents, 'application/xml');

  const feedTitle = data.querySelector('title').textContent;
  const parentFeed = state.feeds.filter((feed) => feed.title === feedTitle);
  const { feedID } = parentFeed[0];

  const items = Array.from(data.querySelectorAll('item')).map((item) => ({
    feedID,
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
  }));

  const alreadyAddedItemsTitles = state.items.map((item) => item.title);
  const newItems = items
    .filter((item) => !alreadyAddedItemsTitles.includes(item.title))
    .map((item) => {
      state.itemsCount += 1;
      return { itemID: state.itemsCount, ...item };
    });

  return newItems;
};
