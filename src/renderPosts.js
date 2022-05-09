/* global document */
/* global bootstrap */
/* eslint no-undef: "error" */
/* eslint no-unused-expressions: ["error", { "allowTernary": true }] */

import 'bootstrap';

const linkStatusChanger = (linkId) => {
  const targertLink = document.querySelector(`a[data-id="${linkId}"]`);
  targertLink.classList.remove('fw-bold');
  targertLink.classList.add('fw-normal');
};

const addContentAndShowModal = (titleContent, descriptionContent, footerLink) => {
  const modalTitle = document.querySelector('.modal-title');
  modalTitle.textContent = titleContent;

  const modalBody = document.querySelector('.modal-body.text-break');
  modalBody.textContent = descriptionContent;

  const modalFooterLink = document.querySelector('.btn.btn-primary.full-article');
  modalFooterLink.href = footerLink;

  const modal = new bootstrap.Modal(document.querySelector('#modal'));
  modal.show();
};

const createUl = () => {
  const ul = document.createElement('ul');
  ul.classList.add(
    'list-group',
    'border-0',
    'rounded-0',
  );
  return ul;
};

const renderList = (posts, isUlExisted) => {
  const ul = isUlExisted ? document.querySelector('.rounded-0.list-group.border-0') : createUl();
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
    button.addEventListener('click', () => {
      linkStatusChanger(id);
      addContentAndShowModal(title, description, link);
    });

    li.append(a, button);
    isUlExisted ? ul.prepend(li) : ul.append(li);
  });
  return ul;
};

const renderPosts = (parsedRSS, postsToRender = '') => {
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

  const { posts } = parsedRSS;

  const renderedList = postsToRender.length > 0
    ? renderList(postsToRender, isUlExisted) : renderList(posts, isUlExisted);

  existingMainContainer.append(renderedList);
};

export default renderPosts;
