/* global document */
/* eslint no-undef: "error" */

import './styles.css';
import 'bootstrap';
import validator from './validator.js';
import initWatchedObject from './view.js';

const state = {
  feeds: [],
  inputValue: '',
};

const watchedState = initWatchedObject(state);

const form = document.querySelector('.rss-form.text-body');

const input = document.getElementById('url-input');

input.addEventListener('input', (e) => {
  watchedState.inputValue = e.target.value;
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  validator(watchedState.inputValue, watchedState.feeds)
    .then((link) => {
      watchedState.feeds.push(link);
      input.classList.remove('is-invalid');
      form.reset();
      input.focus();
    })
    .catch(() => {
      input.classList.add('is-invalid');
    });
});
