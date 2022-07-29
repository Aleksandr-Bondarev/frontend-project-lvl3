const proxifyUrl = (url) => {
  const uri = encodeURIComponent(url);
  const proxy = `https://allorigins.hexlet.app/get?disableCache=true&url=${uri}`;

  return proxy;
};

export default proxifyUrl;
