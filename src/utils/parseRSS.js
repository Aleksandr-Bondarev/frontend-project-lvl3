const postsParser = (posts) => {
  const result = posts.map((item) => {
    const itemTitle = item.querySelector('title').textContent;
    const itemLink = item.querySelector('link').textContent;
    const itemDescription = item.querySelector('description').textContent;
    return {
      title: itemTitle,
      link: itemLink,
      description: itemDescription,
    };
  });
  return result;
};

const parseRSS = (xml) => {
  const parser = new DOMParser();
  const parsedResponse = parser.parseFromString(xml, 'text/xml');
  const errorNode = parsedResponse.querySelector('parsererror');

  if (errorNode) throw new Error('invalidRSS');

  const channel = parsedResponse.querySelector('channel');

  const mainTitle = channel.querySelector('title');
  const titleText = mainTitle.textContent;

  const mainDescription = channel.querySelector('description');
  const descriptionText = mainDescription.textContent;

  const items = channel.querySelectorAll('item');
  const itemsArr = Array.from(items);
  const posts = postsParser(itemsArr);

  return {
    title: titleText,
    description: descriptionText,
    posts,
  };
};

export default parseRSS;
