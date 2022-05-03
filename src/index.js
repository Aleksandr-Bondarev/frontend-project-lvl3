/* global document */

import './styles.css';
import 'bootstrap';
import i18next from 'i18next';
import validator from './validator.js';
import initWatchedObject from './view.js';
import ru from './locales/ru-RU.js';
import getData from './getData.js';
import parseRSS from './parseRSS.js';
import renderFeeds from './renderFeeds.js';
import renderPosts from './renderPosts.js';

const newInstance = i18next.createInstance();
newInstance.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
  },
});

const state = {
  feeds: [],
  inputValue: '',
};

const watchedState = initWatchedObject(state);

const form = document.querySelector('.rss-form.text-body');
const input = document.getElementById('url-input');
const feedback = document.querySelector('.feedback.m-0.position-absolute.small');

input.addEventListener('input', (e) => {
  watchedState.inputValue = e.target.value;
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  validator(watchedState.inputValue, watchedState.feeds)
    .then((link) => {
      watchedState.feeds.push(link);
      input.classList.remove('is-invalid');
      form.reset();
      input.focus();
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.innerText = newInstance.t('success');
      getData(link).then((response) => {
        const { data } = response;
        const parsedData = parseRSS(data);
        renderFeeds(parsedData);
        renderPosts(parsedData);
      });
    })
    .catch((err) => {
      input.classList.add('is-invalid');
      input.classList.add('is-invalid');
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      feedback.innerText = newInstance.t(err.errors);
    });
});
