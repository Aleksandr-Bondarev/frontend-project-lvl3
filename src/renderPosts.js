/* global document */
/* global bootstrap */
/* eslint no-undef: "error" */

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

const renderList = (posts) => {
  const ul = document.createElement('ul');
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
    ul.append(li);
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

  const { posts } = parsedRSS;

  const renderedList = postsToRender.length > 0 ? renderList(postsToRender) : renderList(posts);

  existingMainContainer.append(renderedList);
};

export default renderPosts;
