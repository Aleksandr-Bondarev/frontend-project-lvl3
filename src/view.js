/* eslint no-param-reassign: [
    "error",
    { "props": true, "ignorePropertyModificationsFor": ["input", "submitButton", "feedback"] }
  ]
*/

import * as _ from 'lodash';
import onChange from 'on-change';

const elements = {
  form: document.querySelector('.rss-form.text-body'),
  input: document.getElementById('url-input'),
  feedback: document.querySelector('.feedback.m-0.position-absolute.small'),
  postsContainer: document.querySelector('.container-xxl'),
  submitButton: document.querySelector('button[type="submit"]'),
};

const disableForm = ({ input, submitButton }, boolean) => {
  submitButton.disabled = boolean;
  input.disabled = boolean;
};

const handleSuccessAdding = (
  { form, input, feedback },
  i18nextInstance,
  status,
) => {
  if (!status) return;
  input.classList.remove('is-invalid');
  form.reset();
  input.focus();
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  feedback.innerText = i18nextInstance.t('success');
};

const handleError = (
  { input, feedback },
  errorMessage,
  i18nextInstance,
) => {
  if (errorMessage === '') return;
  input.classList.add('is-invalid');
  input.classList.add('is-invalid');
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');
  feedback.innerText = i18nextInstance.t(errorMessage);
};

const linkStatusChanger = (linkId) => {
  const targetLink = document.querySelector(`a[data-id="${linkId}"]`);
  targetLink.classList.remove('fw-bold');
  targetLink.classList.add('fw-normal');
};

const addContentAndShowModal = (id) => {
  const targetLink = document.querySelector(`a[data-id="${id}"]`);
  const url = targetLink.href;
  const { description } = targetLink.dataset;
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
    a.dataset.description = description;
    a.dataset.id = id;

    a.setAttribute('href', link);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');

    a.classList.add('fw-bold');
    a.textContent = title;

    const button = document.createElement('button');
    button.dataset.id = id;
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';

    button.setAttribute('type', 'button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
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

  const list = renderList(newPosts, isUlExisted);
  existingMainContainer.append(list);
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
      disableForm(elements, value === 'sending');
      break;
    case 'form.success':
      handleSuccessAdding(elements, i18nextInstance, !!value);
      break;
    case 'form.error':
      handleError(elements, value, i18nextInstance);
      break;
    case 'network':
      handleError(elements, value, i18nextInstance);
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

export { elements };

export default initWatchedObject;
