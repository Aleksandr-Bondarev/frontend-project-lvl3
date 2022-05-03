/* global document */
/* eslint no-undef: "error" */

const renderPosts = (parsedRSS) => {
  const postsContainer = document.querySelector('.posts');

  const mainContainer = document.createElement('div');
  mainContainer.classList.add('card', 'border-0');

  const mainTitleContainer = document.createElement('div');
  mainTitleContainer.classList.add('card-body');

  const mainTitle = document.createElement('h2');
  mainTitle.classList.add('card-title', 'h4');
  mainTitle.textContent = 'Посты';

  mainTitleContainer.append(mainTitle);
  mainContainer.append(mainTitleContainer);
  postsContainer.append(mainContainer);

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

    li.append(a);
    li.append(button);
    ul.append(li);
  });

  mainContainer.append(ul);
};

export default renderPosts;
