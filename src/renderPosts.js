/* global document */
/* eslint no-undef: "error" */

const renderPosts = (parsedRSS) => {
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
  const existingMainContainer = document.querySelector('.card.border-0');
  const ul = document.createElement('ul');

  const { posts } = parsedRSS;

  posts.forEach((post, index) => {
    const { title, link } = post;

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
    a.setAttribute('data-id', index);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = title;

    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('data-id', index);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = 'Просмотр';
    button.addEventListener('click', () => {
      document.location = link;
    });

    li.append(a);
    li.append(button);
    ul.append(li);
  });

  existingMainContainer.append(ul);
};

export default renderPosts;
