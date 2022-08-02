/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-restricted-syntax: [0] */

import i18next from 'i18next';
import * as _ from 'lodash';
import ru from './locales/ru-RU.js';
import proxifyUrl from './utils/proxifyUrl.js';
import getData from './utils/getData.js';
import parseRSS from './utils/parseRSS.js';
import validator from './utils/validator.js';
import {
  initWatchedObject,
} from './view.js';

const form = document.querySelector('.rss-form.text-body');
const input = document.getElementById('url-input');
const postsContainer = document.querySelector('.container-xxl');

const i18nextInstance = i18next.createInstance();
i18nextInstance.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
  },
});

const update = (watchedState) => {
  const { resources } = watchedState;
  const posts = JSON.parse(JSON.stringify(watchedState.posts));

  resources.forEach((url) => {
    const proxified = proxifyUrl(url);

    getData(proxified)
      .then((data) => {
        const postsIndex = resources.indexOf(url);
        const currentUrlPreviouslyRecievedPosts = posts[postsIndex];
        const parsedData = parseRSS(data);
        const { posts: gettedPosts } = parsedData;

        const newPosts = _.differenceWith(
          gettedPosts,
          currentUrlPreviouslyRecievedPosts,
          _.isEqual,
        );

        watchedState.posts = [
          ...watchedState.posts,
          ...newPosts,
        ];
      })
      .then((watchedState.disableSubmit = false));
  });
};

const handleNewUrl = (url, addedUrls, watchedState) => {
  if (url === null) return;

  watchedState.disableSubmit = true;

  const validUrl = validator(url, addedUrls);

  if (typeof validUrl === 'object') {
    watchedState.statusSuccess = false;
    watchedState.errorMessage = validUrl;
    watchedState.disableSubmit = false;
    return;
  }

  const proxified = proxifyUrl(validUrl);
  getData(proxified)
    .then((data) => {
      const parsedData = parseRSS(data);
      const { title, description } = parsedData;
      watchedState.feeds = [
        ...watchedState.feeds,
        {
          title,
          description,
        },
      ];
      watchedState.posts = [
        ...watchedState.posts,
        ...parsedData.posts,
      ];
      watchedState.resources.push(url);
      watchedState.errorMessage = '';
      watchedState.statusSuccess = true;
    })
    .catch((err) => { watchedState.errorMessage = err; })
    .then((watchedState.disableSubmit = false))
    .then(() => setInterval(() => update(watchedState), 5000));
};

const app = () => {
  const state = {
    posts: [],
    feeds: [],
    resources: [],
    disableSubmit: '',
    statusSuccess: '',
    errorMessage: '',
    linkToChangeStatus: '',
    modalContent: '',
  };

  const watchedState = initWatchedObject(state, i18nextInstance);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const resources = Array.from(watchedState.resources);
    const url = input.value;
    handleNewUrl(url, resources, watchedState);
  });

  postsContainer.addEventListener('click', (event) => {
    if (event.target.type !== 'button') return;

    const targetButtonId = event.target.attributes[2].value;
    const targetLink = document.querySelector(`a[data-id="${targetButtonId}"]`);
    const url = targetLink.href;
    const description = targetLink.attributes[3].value;
    const title = targetLink.textContent;

    watchedState.linkToChangeStatus = targetButtonId;
    watchedState.modalContent = {
      url,
      description,
      title,
    };
  });
};

export default app;
