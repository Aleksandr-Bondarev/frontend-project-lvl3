/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-restricted-syntax: [0] */

import 'bootstrap';
import i18next from 'i18next';
import * as _ from 'lodash';
import ru from './locales/ru-RU.js';
import proxifyUrl from './utils/proxifyUrl.js';
import getData from './utils/getData.js';
import parseRSS from './utils/parseRSS.js';
import validator from './utils/validator.js';
import initWatchedObject from './view.js';

const form = document.querySelector('.rss-form.text-body');
const input = document.getElementById('url-input');
const postsContainer = document.querySelector('.container-xxl');

const update = (watchedState) => {
  const { posts } = watchedState;
  const resources = watchedState.feeds.map((el) => el.link);

  resources.forEach((url) => {
    const proxified = proxifyUrl(url);
    getData(proxified)
      .then((response) => {
        const data = response.data.contents;
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
      .catch((error) => console.log(error))
      .finally(() => setTimeout(() => update(watchedState), 5000));
  });
};

const handleNewUrl = (url, watchedState) => {
  if (url === null) return;
  const addedUrls = watchedState.feeds.map((el) => el.link);

  const validUrl = validator(url, addedUrls);

  if (typeof validUrl === 'object') {
    watchedState.form.feedback.success = false;
    watchedState.form.feedback.error = validUrl;
    return;
  }

  const proxified = proxifyUrl(validUrl);

  getData(proxified)
    .then((response) => {
      const data = response.data.contents;
      const parsedData = parseRSS(data);
      const { title, description } = parsedData;
      watchedState.feeds = [
        ...watchedState.feeds,
        {
          link: url,
          title,
          description,
        },
      ];
      watchedState.posts = [
        ...watchedState.posts,
        ...parsedData.posts,
      ];
      watchedState.form.feedback.error = '';
      watchedState.form.feedback.success = true;
      watchedState.form.feedback.success = '';
    })
    .catch((err) => {
      if (err.message === 'Network Error') {
        watchedState.form.feedback.error = new Error('networkErr');
      } else { watchedState.form.feedback.error = err; }
    })
    .finally(() => {
      setTimeout(() => update(watchedState), 5000);
      watchedState.form.status = 'filling';
    });
  watchedState.form.status = 'sending';
};

const app = () => {
  const state = {
    posts: [],
    feeds: [],
    form: {
      status: '',
      feedback: {
        success: '',
        error: '',
      },
    },
    clickedButtonId: '',
  };

  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  const watchedState = initWatchedObject(state, i18nextInstance);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const url = input.value;
    handleNewUrl(url, watchedState);
  });

  postsContainer.addEventListener('click', (event) => {
    if (event.target.type !== 'button') return;

    const targetButtonId = event.target.attributes[2].value;
    watchedState.clickedButtonId = targetButtonId;
  });
};

export default app;
