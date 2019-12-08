import BoardComponent from './components/board.js';
import FilterComponent from './components/filter.js';
import LoadMoreButtonComponent from './components/load-more-button.js';
import TaskEditComponent from './components/task-edit.js';
import TaskComponent from './components/task.js';
import SiteMenuComponent from './components/site-menu.js';
import SortComponent from './components/sort.js';
import TasksComponent from './components/tasks.js';
import NoTasksComponent from './components/no-tasks.js';
import {generateTasks, generateFilters} from './mock.js';
import {RenderPosition, render} from './utils.js';

const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const filters = generateFilters();
const tasks = generateTasks(TASK_COUNT);

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  const replaceEditToTask = () => taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  const replaceTaskToEdit = () => taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());

  const escKeydownHandler = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, escKeydownHandler);
    }
  };
  const submitHandler = () => replaceEditToTask();

  const editButtonClickHandler = () => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, escKeydownHandler);
  };

  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);
  editButton.addEventListener(`click`, editButtonClickHandler);

  const editForm = taskEditComponent.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, submitHandler);

  render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

const pasteElements = () => {
  const siteMainElement = document.querySelector(`.main`);
  const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
  render(siteHeaderElement, new SiteMenuComponent().getElement(), RenderPosition.BEFOREEND);
  render(siteMainElement, new FilterComponent(filters, 0).getElement(), RenderPosition.BEFOREEND);

  const boardComponent = new BoardComponent();
  render(siteMainElement, boardComponent.getElement(), RenderPosition.BEFOREEND);

  const isAllTasksArchived = tasks.every((task) => task.isArchive);
  if (isAllTasksArchived) {
    render(boardComponent.getElement(), new NoTasksComponent().getElement(), RenderPosition.BEFOREEND);
  } else {
    render(boardComponent.getElement(), new SortComponent().getElement(), RenderPosition.BEFOREEND);
    render(boardComponent.getElement(), new TasksComponent().getElement(), RenderPosition.BEFOREEND);

    const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);

    tasks.slice(0, SHOWING_TASKS_COUNT_ON_START)
    .forEach((task) => {
      renderTask(taskListElement, task);
    });

    const loadMoreButtonComponent = new LoadMoreButtonComponent();
    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    const loadMoreButtonClickHandler = () => {
      const prevTasksCount = showingTasksCount;
      showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;
      tasks.slice(prevTasksCount, showingTasksCount)
        .forEach((task) => renderTask(taskListElement, task));
      if (showingTasksCount >= tasks.length) {
        loadMoreButtonComponent.getElement().remove();
        loadMoreButtonComponent.removeElement();
      }
    };

    render(boardComponent.getElement(), loadMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);
    loadMoreButtonComponent.getElement().addEventListener(`click`, loadMoreButtonClickHandler);

  }


};

pasteElements();
