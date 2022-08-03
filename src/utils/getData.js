import axios from 'axios';

const getData = (url) => axios.get(url);
// .then((response) => response.data.contents).catch((error) => {
//   console.log('axios error', error);
//   return error;
// throw new Error('networkErr');
// });

export default getData;
