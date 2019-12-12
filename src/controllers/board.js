import LoadMoreButtonComponent from '../components/load-more-button.js';
import TaskEditComponent from '../components/task-edit.js';
import TaskComponent from '../components/task.js';
import SortComponent from '../components/sort.js';
import TasksComponent from '../components/tasks.js';
import NoTasksComponent from '../components/no-tasks.js';
import {render, remove, replace, RenderPosition} from '../utils/render.js';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const createHtmlFragment = (data) => {
  const fragment = document.createDocumentFragment();
  data.forEach((task) => {
    renderTask(fragment, task);
  });
  return fragment;
};

const renderTask = (fragment, task) => {
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);
  const replaceEditToTask = () => replace(taskComponent, taskEditComponent);
  const replaceTaskToEdit = () => replace(taskEditComponent, taskComponent);

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

  taskComponent.setEditButtonClickHandler(editButtonClickHandler);
  taskEditComponent.setSubmitHandler(submitHandler);

  render(fragment, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  render(tasks) {
    const container = this._container.getElement();
    const isAllTasksArchived = !tasks.find((task) => !task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent.getElement(), RenderPosition.BEFOREEND);
    render(container, this._tasksComponent.getElement(), RenderPosition.BEFOREEND);

    const taskListElement = this._tasksComponent.getElement();

    const tasksOnStart = tasks.slice(0, SHOWING_TASKS_COUNT_ON_START);
    render(taskListElement, createHtmlFragment(tasksOnStart), RenderPosition.BEFOREEND);

    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    render(container, this._loadMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(() => {
      const prevTasksCount = showingTasksCount;
      showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON;

      const unrenderedTasks = tasks.slice(prevTasksCount, showingTasksCount);
      render(taskListElement, createHtmlFragment(unrenderedTasks), RenderPosition.BEFOREEND);

      if (showingTasksCount >= tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    });
  }
}
