/* eslint no-param-reassign: ["error", { "props": false }] */

import 'bootstrap';
import i18next from 'i18next';
import * as _ from 'lodash';
import axios from 'axios';
import ru from './locales/ru-RU.js';
import proxifyUrl from './utils/proxifyUrl.js';
import parseRSS from './utils/parseRSS.js';
import validator from './utils/validator.js';
import initWatchedObject from './view.js';

const update = (watchedState) => {
  const { posts } = watchedState;
  const resources = watchedState.feeds.map((el) => el.link);

  resources.forEach((url) => {
    const proxified = proxifyUrl(url);
    axios.get(proxified)
      .then((response) => {
        const data = response.data.contents;
        const linkId = watchedState.feeds.find((el) => el.link === url).id;
        const currentUrlPreviouslyRecievedPosts = posts.filter((post) => post.linkId === linkId);
        const parsedData = parseRSS(data);
        const { posts: gettedPosts } = parsedData;
        gettedPosts.forEach((post) => {
          post.linkId = linkId;
          post.id = _.uniqueId();
          return post;
        });
        const newPosts = _.differenceBy(
          gettedPosts,
          currentUrlPreviouslyRecievedPosts,
          'title',
        );
        watchedState.posts = [
          ...watchedState.posts,
          ...newPosts,
        ];
        console.log(watchedState);
      })
      .catch(() => { watchedState.network = 'networkErr'; })
      .finally(() => setTimeout(() => update(watchedState), 5000));
  });
};

const handleNewUrl = (url, watchedState) => {
  watchedState.network = '';

  if (url === null) return;
  const addedUrls = watchedState.feeds.map((el) => el.link);

  const validUrl = validator(url, addedUrls);

  if (validUrl.message === 'invalidURL') {
    watchedState.form.success = false;
    watchedState.form.error = validUrl.message;
    return;
  }

  const proxified = proxifyUrl(validUrl);

  axios.get(proxified)
    .then((response) => {
      const linkId = watchedState.feeds.length !== 0
        ? watchedState.feeds[watchedState.feeds.length - 1].id + 1
        : 1;
      const data = response.data.contents;
      const parsedData = parseRSS(data);
      const { title, description } = parsedData;
      const postsWithId = parsedData.posts.map((post) => {
        post.linkId = linkId;
        post.id = _.uniqueId();
        return post;
      });
      watchedState.feeds = [
        ...watchedState.feeds,
        {
          id: linkId,
          link: url,
          title,
          description,
        },
      ];
      watchedState.posts = [
        ...watchedState.posts,
        ...postsWithId,
      ];
      watchedState.form.error = '';
      watchedState.form.success = true;
      watchedState.form.success = '';
    })
    .catch((err) => {
      if (err.message === 'Network Error') {
        watchedState.network = 'networkErr';
      } else { watchedState.form.error = err.message; }
    })
    .finally(() => {
      setTimeout(() => update(watchedState), 5000);
      watchedState.form.status = 'filling';
      console.log(watchedState);
    });
  watchedState.form.status = 'sending';
};

const app = ({ form, input, postsContainer }) => {
  const state = {
    posts: [],
    readPostsIds: [],
    feeds: [],
    form: {
      status: '',
      success: '',
      error: '',
    },
    targetPostId: '',
    network: '',
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

    const targetPostId = event.target.attributes[2].value;

    watchedState.targetPostId = targetPostId;
    watchedState.readPostsIds.push(targetPostId);
  });
};

export default app;
