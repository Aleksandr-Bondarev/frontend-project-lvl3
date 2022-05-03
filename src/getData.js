import axios from 'axios';

const getData = (url) => axios.get(url).catch(() => {
  throw new Error('networkErr');
});

export default getData;
