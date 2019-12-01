import {createBoardTemplate} from './components/board.js';
import {createFilterTemplate} from './components/filter.js';
import {createLoadMoreButtonTemplate} from './components/load-more-button.js';
import {createTaskEditTemplate} from './components/task-edit.js';
import {createTaskTemplate} from './components/task.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {generateTasks, generateFilters} from './mock.js';

const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const filters = generateFilters();
const tasks = generateTasks(TASK_COUNT);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

/*
const renderHtmlParts = (quantity, template) => {
  const arr = [];
  let fragment = document.createDocumentFragment();
  for (let i = 0; i < quantity; i++) {
    arr.push(template);
  }
  fragment = arr.join(``);
  return fragment;
};
*/

const loadMoreButtonClickHandler = (node, btn) => {
  let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

  return () => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    tasks.slice(prevTasksCount, showingTasksCount)
      .forEach((task) => render(node, createTaskTemplate(task), `beforeend`));

    if (showingTasksCount >= tasks.length) {
      btn.remove();
    }
  };
};

const pasteElements = () => {
  const siteMainElement = document.querySelector(`.main`);
  const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

  render(siteHeaderElement, createSiteMenuTemplate(), `beforeend`);
  render(siteMainElement, createFilterTemplate(filters), `beforeend`);
  render(siteMainElement, createBoardTemplate(), `beforeend`);

  const taskListElement = siteMainElement.querySelector(`.board__tasks`);
  render(taskListElement, createTaskEditTemplate(tasks[0]), `beforeend`);

  tasks.slice(1, SHOWING_TASKS_COUNT_ON_START).forEach((task) => render(taskListElement, createTaskTemplate(task), `beforeend`));

  const boardElement = siteMainElement.querySelector(`.board`);
  render(boardElement, createLoadMoreButtonTemplate(), `beforeend`);

  const loadMoreButton = boardElement.querySelector(`.load-more`);
  loadMoreButton.addEventListener(`click`, loadMoreButtonClickHandler(taskListElement, loadMoreButton));
};

pasteElements();
