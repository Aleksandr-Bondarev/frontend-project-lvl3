/* global document */

import './styles.css';
import 'bootstrap';
import i18next from 'i18next';
import initWatchedObject from './view.js';
import ru from './locales/ru-RU.js';

const form = document.querySelector('.rss-form.text-body');
const input = document.getElementById('url-input');

const i18nextInstance = i18next.createInstance();
i18nextInstance.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
  },
});

const state = {
  posts: [],
  resources: [],
  temporaryValue: '',
  inputValue: '',
};

const watchedState = initWatchedObject(i18nextInstance, state);

input.addEventListener('input', (e) => {
  watchedState.inputValue = e.target.value;
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  watchedState.resources.push(watchedState.inputValue);
});
