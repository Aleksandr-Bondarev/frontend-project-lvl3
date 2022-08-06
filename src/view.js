/* eslint prefer-arrow-callback: [0] */
/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint func-names: [0] */

import * as _ from 'lodash';
import onChange from 'on-change';

const form = document.querySelector('.rss-form.text-body');
const input = document.getElementById('url-input');
const feedback = document.querySelector(
  '.feedback.m-0.position-absolute.small',
);
const submitButton = document.querySelector('button[type="submit"]');

const disableForm = (button, inputNode, boolean) => {
  button.disabled = boolean;
  inputNode.disabled = boolean;
};

const handleSuccessAdding = (
  inputNode,
  formNode,
  feedbackNode,
  i18nextInstance,
  status,
) => {
  if (!status) return;
  inputNode.classList.remove('is-invalid');
  formNode.reset();
  inputNode.focus();
  feedbackNode.classList.remove('text-danger');
  feedbackNode.classList.add('text-success');
  feedbackNode.innerText = i18nextInstance.t('success');
};

const handleError = (inputNode, feedbackNode, errorMessage, i18nextInstance) => {
  if (errorMessage === '') return;
  inputNode.classList.add('is-invalid');
  inputNode.classList.add('is-invalid');
  feedbackNode.classList.remove('text-success');
  feedbackNode.classList.add('text-danger');
  feedbackNode.innerText = i18nextInstance.t(errorMessage);
};

const linkStatusChanger = (linkId) => {
  const targetLink = document.querySelector(`a[data-id="${linkId}"]`);
  targetLink.classList.remove('fw-bold');
  targetLink.classList.add('fw-normal');
};

const addContentAndShowModal = (id) => {
  const targetLink = document.querySelector(`a[data-id="${id}"]`);
  const url = targetLink.href;
  const description = targetLink.attributes[3].value;
  const title = targetLink.textContent;

  const modalTitle = document.querySelector('.modal-title');
  modalTitle.textContent = title;

  const modalBody = document.querySelector('.modal-body.text-break');
  modalBody.textContent = description;

  const modalFooterLink = document.querySelector(
    '.btn.btn-primary.full-article',
  );
  modalFooterLink.href = url;
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
    const {
      title, link, description, id,
    } = post;

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

const containerCreator = (container, containerName) => {
  const createdMainContainer = document.createElement('div');
  createdMainContainer.classList.add('card', 'border-0');

  const titleContainer = document.createElement('div');
  titleContainer.classList.add('card-body');

  const mainHeader = document.createElement('h2');
  mainHeader.textContent = containerName;
  mainHeader.classList.add('card-title', 'h4');

  titleContainer.append(mainHeader);
  createdMainContainer.append(titleContainer);
  container.append(createdMainContainer);
};

const renderPosts = (actualPosts, previousPosts) => {
  const newPosts = previousPosts.length !== 0
    ? _.differenceWith(actualPosts, previousPosts, _.isEqual)
    : actualPosts;

  const postsContainer = document.querySelector('.posts');
  if (previousPosts.length === 0) {
    containerCreator(postsContainer, 'Посты');
  }

  const existingMainContainer = postsContainer.childNodes[0];
  const isUlExisted = existingMainContainer.childNodes[1] !== undefined;

  const renderedList = renderList(newPosts, isUlExisted);
  existingMainContainer.append(renderedList);
};

const renderFeeds = (actualFeeds, previousFeeds) => {
  const newFeeds = previousFeeds.length !== 0
    ? _.differenceWith(actualFeeds, previousFeeds, _.isEqual)
    : actualFeeds;

  const [{ title, description }] = newFeeds;

  const feedsContainer = document.querySelector('.feeds');

  if (feedsContainer.childNodes.length === 0) {
    containerCreator(feedsContainer, 'Фиды');
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
      renderPosts(value, previousValue);
      break;
    case 'feeds':
      renderFeeds(value, previousValue);
      break;
    case 'form.status':
      disableForm(submitButton, input, value === 'sending');
      break;
    case 'form.success':
      handleSuccessAdding(input, form, feedback, i18nextInstance, !!value);
      break;
    case 'form.error':
      handleError(input, feedback, value, i18nextInstance);
      break;
    case 'network':
      handleError(input, feedback, value, i18nextInstance);
      break;
    case 'targetPostId':
      addContentAndShowModal(value);
      break;
    case 'readPostsIds':
      linkStatusChanger(value[value.length - 1]);
      break;
    default:
      break;
  }
});

export default initWatchedObject;
