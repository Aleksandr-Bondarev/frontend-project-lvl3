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
      .catch(() => { watchedState.network.error = 'networkErr'; })
      .finally(() => setTimeout(() => update(watchedState), 5000));
  });
};

const handleNewUrl = (url, watchedState) => {
  watchedState.network.error = null;

  const addedUrls = watchedState.feeds.map((el) => el.link);
  const validUrl = validator(url, addedUrls);

  if (validUrl.message) {
    watchedState.form.status = null;
    watchedState.form.error = validUrl.message;
    return;
  }

  const proxified = proxifyUrl(validUrl);
  watchedState.network.status = 'loading';
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
      watchedState.form.error = null;
      watchedState.form.status = 'success';
      watchedState.form.status = null;
    })
    .catch((err) => {
      if (err.message === 'Network Error') watchedState.network.error = 'networkErr';
      else if (err.message === 'invalidRSS') watchedState.form.error = 'invalidRSS';
      else watchedState.form.error = 'unknownError';
    })
    .finally(() => {
      setTimeout(() => update(watchedState), 5000);
      watchedState.network.status = 'idle';
    });
};

const app = () => {
  const elements = {
    form: document.querySelector('.rss-form.text-body'),
    input: document.getElementById('url-input'),
    feedback: document.querySelector('.feedback.m-0.position-absolute.small'),
    postsContainer: document.querySelector('.container-xxl'),
    submitButton: document.querySelector('button[type="submit"]'),
  };

  const { form, postsContainer } = elements;

  const state = {
    posts: [],
    readPostsIds: [],
    feeds: [],
    form: {
      status: null,
      error: null,
    },
    targetPostId: null,
    network: {
      status: 'idle',
      error: null,
    },
  };

  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  const watchedState = initWatchedObject(state, i18nextInstance, elements);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const url = formData.get('url');
    handleNewUrl(url, watchedState);
  });

  postsContainer.addEventListener('click', (event) => {
    if (event.target.type !== 'button') return;

    const targetPostId = event.target.dataset.id;

    watchedState.targetPostId = targetPostId;
    watchedState.readPostsIds.push(targetPostId);
  });
};

export default app;
