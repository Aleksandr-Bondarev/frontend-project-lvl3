/* global document */
/* eslint no-undef: "error" */

const renderFeeds = (parsedRSS) => {
  const feeds = document.querySelector('.feeds');

  if (feeds.childNodes.length === 0) {
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
  }
  const existingMainContainer = feeds.childNodes[0];
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  const li = document.createElement('li');
  li.classList.add('list-group-item', 'border-0', 'border-end-0');

  const listHeader = document.createElement('h3');
  listHeader.classList.add('h6', 'm-0');
  listHeader.textContent = parsedRSS.title;

  const listParagraph = document.createElement('p');
  listParagraph.classList.add('m-0', 'small', 'text-black-50');
  listParagraph.textContent = parsedRSS.description;

  li.append(listHeader);
  li.append(listParagraph);
  ul.append(li);
  existingMainContainer.append(ul);
};

export default renderFeeds;
