/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-restricted-syntax: [0] */

import i18next from 'i18next';
// import * as _ from 'lodash';
import onChange from 'on-change';
import ru from './locales/ru-RU.js';
import proxifyUrl from './utils/proxifyUrl.js';
import getData from './utils/getData.js';
import parseRSS from './utils/parseRSS.js';
import validator from './utils/validator.js';
import {
  disableSubmit,
  handleError,
  handleSuccessAdding,
  linkStatusChanger,
  addContentAndShowModal,
  renderFeeds,
  renderPosts,
} from './view.js';

const form = document.querySelector('.rss-form.text-body');
const input = document.getElementById('url-input');
const feedback = document.querySelector(
  '.feedback.m-0.position-absolute.small',
);
const postsContainer = document.querySelector('.container-xxl');
const submitButton = document.querySelector('button[type="submit"]');

const i18nextInstance = i18next.createInstance();
i18nextInstance.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
  },
});

const handleNewUrl = (url, addedUrls, watchedState) => {
  if (url === null) return;

  watchedState.disableSubmit = true;

  const validUrl = validator(url, addedUrls);

  if (typeof validUrl === 'object') {
    handleError(input, feedback, validUrl, i18nextInstance);
    watchedState.disableSubmit = false;
    return;
  }

  const proxified = proxifyUrl(validUrl);
  getData(proxified)
    .then((data) => {
      const parsedData = parseRSS(data);
      const { title, description } = parsedData;
      watchedState.feeds.push({
        title,
        description,
      });
      watchedState.posts.push(parsedData.posts);
      watchedState.resources.push(url);
      handleSuccessAdding(input, form, feedback, i18nextInstance);
    })
    .catch((err) => { handleError(input, feedback, err, i18nextInstance); })
    .then((watchedState.disableSubmit = false));
  // .then(() => setInterval(() => update(watchedState), 5000));
};

// const update = (watchedState) => {
//   console.log('waaaaaaaaaatchedstate', watchedState);
//   const { resources } = watchedState;
//   const posts = JSON.parse(JSON.stringify(watchedState.posts));

//   console.log('resources', resources);

//   resources.forEach((url) => {
//     const proxified = proxifyUrl(url);

//     getData(proxified)
//       .then((data) => {
//         const postsIndex = resources.indexOf(url);
//         console.log('POOOST INDEEEEEEEEX', postsIndex);
//         const currentUrlPreviouslyRecievedPosts = posts[postsIndex];
//         const parsedData = parseRSS(data);
//         const { posts: gettedPosts } = parsedData;

//         const newPosts = _.differenceWith(
//           gettedPosts,
//           currentUrlPreviouslyRecievedPosts,
//           _.isEqual,
//         );

//         // newPosts.forEach((post) => posts[postsIndex].push(post));

//         if (newPosts.length > 0) watchedState.posts[postsIndex].push(newPosts);

//         // watchedState.posts[postsIndex] = [
//         //   ...watchedState.posts[postsIndex],
//         //   ...newPosts,
//         // ];

//         // renderPosts(parsedData, newPosts);
//         // setTimeout(() => update(watchedState), 5000);
//       })
//       .then((watchedState.disableSubmit = false));
//   });
// };

// eslint-disable-next-line
const initWatchedObject = (state) => onChange(state, function (path, value, previousValue, applyData) {
  switch (path) {
    case 'posts':
      if (previousValue.length === value.length) {
      // ...
        break;
      }
      renderPosts(value[value.length - 1]);
      break;
    case 'feeds':
      if (previousValue.length === value.length) {
        // ...
        break;
      }
      renderFeeds(value[value.length - 1]);
      break;
    case 'disableSubmit':
      disableSubmit(submitButton, value);
      break;
    default:
      break;
  }
});

const app = () => {
  const state = {
    posts: [],
    feeds: [],
    resources: [],
    disableSubmit: '',
  };

  const watchedState = initWatchedObject(state);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const resources = Array.from(watchedState.resources);
    const url = input.value;
    handleNewUrl(url, resources, watchedState);
  });

  postsContainer.addEventListener('click', (event) => {
    if (event.target.type !== 'button') return;

    const targetButtonId = event.target.attributes[2].value;
    const targetLink = linkStatusChanger(targetButtonId);

    const targetLinkUrl = targetLink.href;
    const targetLinkDescription = targetLink.attributes[3].value;
    const targetLinkTitle = targetLink.textContent;

    addContentAndShowModal(
      targetLinkTitle,
      targetLinkDescription,
      targetLinkUrl,
    );
  });
};

export default app;
