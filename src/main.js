import BoardComponent from './components/board.js';
import FilterComponent from './components/filter.js';
import LoadMoreButtonComponent from './components/load-more-button.js';
import TaskEditComponent from './components/task-edit.js';
import TaskComponent from './components/task.js';
import SiteMenuComponent from './components/site-menu.js';
import {generateTasks, generateFilters} from './mock.js';
import {RenderPosition, render} from './utils.js';

const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const filters = generateFilters();
const tasks = generateTasks(TASK_COUNT);

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

const renderTask = (task, component) => {
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);
  editButton.addEventListener(`click`, () => {
    component.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  });

  const editForm = taskEditComponent.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, () => {
    component.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  });

  render(component, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

const loadMoreButtonClickHandler = (node, btn) => {
  let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

  return () => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    tasks.slice(prevTasksCount, showingTasksCount)
      .forEach((task) => renderTask(task, node));

    if (showingTasksCount >= tasks.length) {
      btn.getElement().remove();
      btn.removeElement();
    }
  };
};

const pasteElements = () => {
  const siteMainElement = document.querySelector(`.main`);
  const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
  render(siteHeaderElement, new SiteMenuComponent().getElement(), RenderPosition.BEFOREEND);
  render(siteMainElement, new FilterComponent(filters, 0).getElement(), RenderPosition.BEFOREEND);

  const boardComponent = new BoardComponent();
  render(siteMainElement, boardComponent.getElement(), RenderPosition.BEFOREEND);

  const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);
  render(taskListElement, new TaskEditComponent(tasks[0]).getElement(), RenderPosition.BEFOREEND);

  tasks.slice(0, SHOWING_TASKS_COUNT_ON_START - 1)
    .forEach((task) => {
      renderTask(task, taskListElement);
    });

  const loadMoreButtonComponent = new LoadMoreButtonComponent();
  render(boardComponent.getElement(), loadMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);
  loadMoreButtonComponent.getElement().addEventListener(`click`, loadMoreButtonClickHandler(taskListElement, loadMoreButtonComponent));
};

pasteElements();
