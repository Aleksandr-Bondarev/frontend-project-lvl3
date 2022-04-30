/* global document */
/* eslint no-undef: "error" */

import './styles.css';
import 'bootstrap';
import i18next from 'i18next';
import validator from './validator.js';
import initWatchedObject from './view.js';
import ru from './locales/ru-RU.js';

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
const feedback = document.querySelector(
  '.feedback.m-0.position-absolute.small',
);

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
    })
    .catch((err) => {
      input.classList.add('is-invalid');
      input.classList.add('is-invalid');
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      feedback.innerText = newInstance.t(err.errors);
    });
});
