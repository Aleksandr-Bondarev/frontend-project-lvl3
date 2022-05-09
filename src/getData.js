import axios from 'axios';

const getData = (url) => {
  const uri = encodeURIComponent(url);
  const proxy = `https://allorigins.hexlet.app/get?disableCache=true&url=${uri}`;

  return axios.get(proxy).then((response) => response.data.contents).catch(() => {
    throw new Error('networkErr');
  });
};

export default getData;
