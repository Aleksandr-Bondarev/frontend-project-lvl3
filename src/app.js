/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-restricted-syntax: [0] */

import i18next from 'i18next';
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
  watchedState.disableSubmit = true;

  const validUrl = validator(url, addedUrls);

  if (typeof validUrl === 'string') {
    const proxified = proxifyUrl(validUrl);
    getData(proxified)
      .then((data) => {
        try {
          const parsedData = parseRSS(data);
          renderFeeds(parsedData);
          renderPosts(parsedData);
          watchedState.posts.push(parsedData.posts);
          watchedState.resources.push(url);
          handleSuccessAdding(input, form, feedback, i18nextInstance);
          watchedState.inputValue = null;
        } catch (err) {
          handleError(input, feedback, err, i18nextInstance);
        }
      })
      .then((watchedState.disableSubmit = false));
  } else {
    handleError(input, feedback, validUrl, i18nextInstance);
    watchedState.disableSubmit = false;
  }
};

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
        const newPosts = gettedPosts.map((newPost) => {
          const intersection = currentUrlPreviouslyRecievedPosts
            .map((oldPost) => {
              if (
                oldPost.link === newPost.link
                && oldPost.title === newPost.title
                && oldPost.description === newPost.description
              ) {
                return oldPost;
              }
              return null;
            })
            .filter((el) => el !== null);
          if (intersection.length === 0) {
            return newPost;
          }
          return null;
        });

        const postsToRender = newPosts.filter((el) => el !== null);
        postsToRender.forEach((post) => posts[postsIndex].push(post));
        watchedState.posts[postsIndex] = [
          ...watchedState.posts[postsIndex],
          ...postsToRender,
        ];

        renderPosts(parsedData, postsToRender);
        setTimeout(() => update(watchedState), 5000);
      })
      .then((watchedState.disableSubmit = false));
  });
};

// eslint-disable-next-line
const initWatchedObject = (i18nextInstance, state) => onChange(state, function (path, value) {
  switch (path) {
    case 'inputValue': {
      if (value === null) {
        break;
      }
      const resources = Array.from(this.resources);
      handleNewUrl(value, resources, this);
      break;
    }
    case 'resources':
      update(this);
      break;
    case 'disableSubmit':
      console.log('i am here', value);
      disableSubmit(submitButton, value);
      break;
    default:
      break;
  }
});

const app = () => {
  const state = {
    posts: [],
    resources: [],
    inputValue: '',
    disableSubmit: '',
  };

  const watchedState = initWatchedObject(i18nextInstance, state);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    watchedState.inputValue = input.value;
    console.log(watchedState);
  });

  postsContainer.addEventListener('click', (event) => {
    if (event.target.type === 'button') {
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
    }
  });
};

export default app;
