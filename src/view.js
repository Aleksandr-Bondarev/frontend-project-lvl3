/* eslint no-restricted-syntax: [0] */
/* eslint prefer-arrow-callback: [0] */
/* eslint func-names: [0] */

import onChange from 'on-change';

const initWatchedObject = (state) => onChange(state, function () {});

export default initWatchedObject;
