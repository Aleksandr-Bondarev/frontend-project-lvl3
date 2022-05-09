/* global document */

import i18next from 'i18next';
import initWatchedObject from './view.js';
import ru from './locales/ru-RU.js';

const app = () => {
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
    watchedState.temporaryValue = watchedState.inputValue;
  });
};

export default app;
