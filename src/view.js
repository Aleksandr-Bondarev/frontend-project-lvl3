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
const feedback = document.querySelector('.feedback.m-0.position-absolute.small');

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
    .then((response) => {
      const { data } = response;
      try {
        const parsedData = parseRSS(data);
        renderFeeds(parsedData);
        renderPosts(parsedData);
        watchedState.posts.push(parsedData.posts);
        watchedState.resources.push(url);
        handleSuccessAdding(input, form, feedback);
        feedback.innerText = i18nextInstance.t('success');
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
  const { posts } = watchedState;
  resources.forEach((url) => {
    getData(url).then((response) => {
      const { data } = response;
      const parsedData = parseRSS(data);
      const { posts: gettedPosts } = parsedData;
      const newPosts = gettedPosts.map((post1) => {
        const intersection = posts.map((post2) => {
          if (post1.link === post2.link) {
            return post2;
          }
          return null;
        });
        intersection.filter((el) => el !== null);
        if (intersection.length === 0) {
          return post1;
        }
        return null;
      });
      const postsToRender = newPosts.filter((el) => el !== null);
      const urlIndex = resources.indexOf(url);
      postsToRender.forEach((post) => posts[urlIndex].push(post));
      renderPosts(parsedData, postsToRender);
      setTimeout(() => update(watchedState), 5000);
    });
  });
};

const initWatchedObject = (i18nextInstance, state) => onChange(state, function (path, value) {
  switch (path) {
    case 'temporaryValue': {
      const resources = Array.from(this.resources);
      handleNewUrl(i18nextInstance, value, resources, this);
      break;
    }
    // case 'resources':
    //   update(this);
    //   break;
    default:
      console.log('Hello, World!');
  }
});

export default initWatchedObject;
