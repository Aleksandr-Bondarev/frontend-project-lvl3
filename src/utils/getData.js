import axios from 'axios';

const getData = (url) => axios.get(url).then((response) => response.data.contents).catch(() => {
  throw new Error('networkErr');
});

export default getData;
