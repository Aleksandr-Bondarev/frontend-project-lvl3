/* eslint prefer-arrow-callback: [0] */
/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint func-names: [0] */

import 'bootstrap';
import * as _ from 'lodash';
import onChange from 'on-change';

const form = document.querySelector('.rss-form.text-body');
const input = document.getElementById('url-input');
const feedback = document.querySelector(
  '.feedback.m-0.position-absolute.small',
);
const submitButton = document.querySelector('button[type="submit"]');

const disableSubmit = (node, boolean) => {
  node.disabled = boolean;
};

const handleSuccessAdding = (
  inputNode,
  formNode,
  feedbackNode,
  i18nextInstance,
) => {
  inputNode.classList.remove('is-invalid');
  formNode.reset();
  inputNode.focus();
  feedbackNode.classList.remove('text-danger');
  feedbackNode.classList.add('text-success');
  feedbackNode.innerText = i18nextInstance.t('success');
};

const handleError = (inputNode, feedbackNode, error, i18nextInstance) => {
  inputNode.classList.add('is-invalid');
  inputNode.classList.add('is-invalid');
  feedbackNode.classList.remove('text-success');
  feedbackNode.classList.add('text-danger');
  feedbackNode.innerText = i18nextInstance.t(error.message);
};

const linkStatusChanger = (linkId) => {
  const targetLink = document.querySelector(`a[data-id="${linkId}"]`);
  targetLink.classList.remove('fw-bold');
  targetLink.classList.add('fw-normal');
};

const addContentAndShowModal = ({ url, description, title }) => {
  const modalTitle = document.querySelector('.modal-title');
  modalTitle.textContent = title;

  const modalBody = document.querySelector('.modal-body.text-break');
  modalBody.textContent = description;

  const modalFooterLink = document.querySelector(
    '.btn.btn-primary.full-article',
  );
  modalFooterLink.href = url;

  // eslint-disable-next-line
  const modal = new bootstrap.Modal(document.querySelector('#modal'));
  modal.show();
};

const createUl = () => {
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  return ul;
};

const renderList = (posts, isUlExisted) => {
  const ul = isUlExisted
    ? document.querySelector('.rounded-0.list-group.border-0')
    : createUl();
  posts.forEach((post) => {
    const id = Math.floor(Math.random() * 100000);
    const { title, link, description } = post;

    const li = document.createElement('li');
    li.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );

    const a = document.createElement('a');
    a.setAttribute('href', link);
    a.classList.add('fw-bold');
    a.setAttribute('data-id', id);
    a.setAttribute('data-description', description);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = title;

    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('data-id', id);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = 'Просмотр';

    li.append(a, button);
    if (isUlExisted) {
      ul.prepend(li);
    } else {
      ul.append(li);
    }
  });
  return ul;
};

const renderPosts = (posts, postsToRender = '') => {
  if (typeof postsToRender === 'object' && postsToRender.length === 0) {
    return;
  }
  const postsContainer = document.querySelector('.posts');

  if (postsContainer.childNodes.length === 0) {
    const createdMainContainer = document.createElement('div');
    createdMainContainer.classList.add('card', 'border-0');

    const mainTitleContainer = document.createElement('div');
    mainTitleContainer.classList.add('card-body');

    const createdMainTitle = document.createElement('h2');
    createdMainTitle.classList.add('card-title', 'h4');
    createdMainTitle.textContent = 'Посты';

    mainTitleContainer.append(createdMainTitle);
    createdMainContainer.append(mainTitleContainer);
    postsContainer.append(createdMainContainer);
  }

  const existingMainContainer = postsContainer.childNodes[0];

  const isUlExisted = existingMainContainer.childNodes[1] !== undefined;

  const renderedList = postsToRender.length > 0
    ? renderList(postsToRender, isUlExisted)
    : renderList(posts, isUlExisted);

  existingMainContainer.append(renderedList);
};

const containerCreator = (feeds) => {
  const createdMainContainer = document.createElement('div');
  createdMainContainer.classList.add('card', 'border-0');

  const titleContainer = document.createElement('div');
  titleContainer.classList.add('card-body');

  const mainHeader = document.createElement('h2');
  mainHeader.textContent = 'Фиды';
  mainHeader.classList.add('card-title', 'h4');

  titleContainer.append(mainHeader);
  createdMainContainer.append(titleContainer);
  feeds.append(createdMainContainer);
};

const renderFeeds = ([{ title, description }]) => {
  const feedsContainer = document.querySelector('.feeds');

  if (feedsContainer.childNodes.length === 0) {
    containerCreator(feedsContainer);
  }
  const existingMainContainer = feedsContainer.childNodes[0];
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  const li = document.createElement('li');
  li.classList.add('list-group-item', 'border-0', 'border-end-0');

  const listHeader = document.createElement('h3');
  listHeader.classList.add('h6', 'm-0');
  listHeader.textContent = title;

  const listParagraph = document.createElement('p');
  listParagraph.classList.add('m-0', 'small', 'text-black-50');
  listParagraph.textContent = description;

  li.append(listHeader);
  li.append(listParagraph);
  ul.append(li);
  existingMainContainer.append(ul);
};

// eslint-disable-next-line
const initWatchedObject = (state, i18nextInstance) => onChange(state, function (path, value, previousValue) {
  switch (path) {
    case 'posts':
      if (previousValue.length !== 0) {
        const newPosts = _.differenceWith(value, previousValue, _.isEqual);
        renderPosts(newPosts);
        break;
      }
      renderPosts(value);
      break;
    case 'feeds':
      if (previousValue.length !== 0) {
        const newFeeds = _.differenceWith(value, previousValue, _.isEqual);
        renderPosts(newFeeds);
        break;
      }
      renderFeeds(value);
      break;
    case 'disableSubmit':
      disableSubmit(submitButton, value);
      break;
    case 'statusSuccess':
      if (value !== true) break;
      handleSuccessAdding(input, form, feedback, i18nextInstance);
      break;
    case 'errorMessage':
      if (value === '') break;
      console.log('error', value);
      handleError(input, feedback, value, i18nextInstance);
      break;
    case 'linkToChangeStatus':
      linkStatusChanger(value);
      break;
    case 'modalContent':
      console.log(value);
      addContentAndShowModal(value);
      break;
    default:
      break;
  }
});

export {
  initWatchedObject,
  handleError,
  handleSuccessAdding,
  linkStatusChanger,
  addContentAndShowModal,
};
