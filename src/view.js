/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-restricted-syntax: [0] */
/* eslint prefer-arrow-callback: [0] */
/* eslint func-names: [0] */
/* global document */

import onChange from 'on-change';
import getData from './getData.js';
import parseRSS from './parseRSS.js';
import renderFeeds from './renderFeeds.js';
import renderPosts from './renderPosts.js';
import validator from './validator.js';

const form = document.querySelector('.rss-form.text-body');
const input = document.getElementById('url-input');
const feedback = document.querySelector(
  '.feedback.m-0.position-absolute.small',
);

const handleSuccessAdding = (inputNode, formNode, feedbackNode) => {
  inputNode.classList.remove('is-invalid');
  formNode.reset();
  inputNode.focus();
  feedbackNode.classList.remove('text-danger');
  feedbackNode.classList.add('text-success');
};

const handleError = (inputNode, feedbackNode) => {
  inputNode.classList.add('is-invalid');
  inputNode.classList.add('is-invalid');
  feedbackNode.classList.remove('text-success');
  feedbackNode.classList.add('text-danger');
};

const handleNewUrl = (i18nextInstance, url, addedUrls, watchedState) => {
  validator(url, addedUrls)
    .then((validUrl) => getData(validUrl))
    .then((data) => {
      try {
        const parsedData = parseRSS(data);
        renderFeeds(parsedData);
        renderPosts(parsedData);
        watchedState.posts.push(parsedData.posts);
        watchedState.resources.push(url);
        handleSuccessAdding(input, form, feedback);
        feedback.innerText = i18nextInstance.t('success');
        watchedState.temporaryValue = null;
      } catch (err) {
        handleError(input, feedback);
        feedback.innerText = i18nextInstance.t(err.message);
      }
    })
    .catch((err) => {
      handleError(input, feedback);
      feedback.innerText = i18nextInstance.t(err.message);
    });
};

const update = (watchedState) => {
  const { resources } = watchedState;
  const posts = JSON.parse(JSON.stringify(watchedState.posts));
  resources.forEach((url) => {
    getData(url).then((data) => {
      const postsIndex = resources.indexOf(url);
      const currentUrlPreviouslyRecievedPosts = posts[postsIndex];
      const parsedData = parseRSS(data);
      const { posts: gettedPosts } = parsedData;
      const newPosts = gettedPosts.map((newPost) => {
        const intersection = currentUrlPreviouslyRecievedPosts.map((oldPost) => {
          if (
            oldPost.link === newPost.link
            && oldPost.title === newPost.title
            && oldPost.description === newPost.description
          ) {
            return oldPost;
          }
          return null;
        }).filter((el) => el !== null);
        if (intersection.length === 0) {
          return newPost;
        }
        return null;
      });
      const postsToRender = newPosts.filter((el) => el !== null);
      postsToRender.forEach((post) => posts[postsIndex].push(post));
      watchedState.posts[postsIndex] = [...watchedState.posts[postsIndex], ...postsToRender];
      renderPosts(parsedData, postsToRender);
      setTimeout(() => update(watchedState), 5000);
    });
  });
};

const initWatchedObject = (i18nextInstance, state) => onChange(state, function (path, value) {
  switch (path) {
    case 'temporaryValue': {
      if (value === null) {
        break;
      }
      const resources = Array.from(this.resources);
      handleNewUrl(i18nextInstance, value, resources, this);
      break;
    }
    case 'resources':
      update(this);
      break;
    default:
      break;
  }
});

export default initWatchedObject;
