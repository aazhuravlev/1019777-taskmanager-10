import LoadMoreButtonComponent from '../components/load-more-button.js';
import SortComponent, {SortType} from '../components/sort.js';
import TasksComponent from '../components/tasks.js';
import NoTasksComponent from '../components/no-tasks.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import TaskController from './task.js';
import {sortTasks} from '../utils/common.js';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

// const createHtmlFragment = (data) => {
//   const fragment = document.createDocumentFragment();
//   data.forEach((task) => {
//     renderTask(fragment, task);
//   });
//   return fragment;
// };

const renderTasks = (taskListElement, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);
    taskController.render(task);
    return taskController;
  });
};

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._tasks = [];
    this._showedTaskControllers = [];
    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this.loadMoreButtonClickHandler = this.loadMoreButtonClickHandler.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(tasks) {
    this._tasks = tasks;

    const container = this._container.getElement();
    const isAllTasksArchived = !this._tasks.find((task) => !task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent.getElement(), RenderPosition.BEFOREEND);
    render(container, this._tasksComponent.getElement(), RenderPosition.BEFOREEND);

    const taskListElement = this._tasksComponent.getElement();
    const tasksOnStart = this._tasks.slice(0, this._showingTasksCount);

    const newTasks = renderTasks(taskListElement, tasksOnStart, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    this._renderLoadMoreButton();
  }

  _renderLoadMoreButton() {
    if (this._showingTasksCount >= this._tasks.length) {
      return;
    }

    render(this._container.getElement(), this._loadMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(this.loadMoreButtonClickHandler);
  }

  _onDataChange(taskController, oldData, newData) {
    const index = this._tasks.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), newData, this._tasks.slice(index + 1));

    taskController.render(this._tasks[index]);
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    let sortedTasks = [];

    sortedTasks = sortTasks(this._tasks, sortType);
    if (sortType === SortType.DEFAULT[0]) {
      sortedTasks = this._tasks.slice(0, this._showingTasksCount);
    }

    const taskListElement = this._tasksComponent.getElement();

    taskListElement.innerHTML = ``;

    const newTasks = renderTasks(taskListElement, sortedTasks, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = newTasks;

    if (sortType === SortType.DEFAULT[0]) {
      this._renderLoadMoreButton();
    } else {
      remove(this._loadMoreButtonComponent);
    }
  }

  loadMoreButtonClickHandler() {
    const prevTasksCount = this._showingTasksCount;
    this._showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON;
    const unrenderedTasks = this._tasks.slice(prevTasksCount, this._showingTasksCount);

    const newTasks = renderTasks(this._tasksComponent.getElement(), unrenderedTasks, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

    if (this._showingTasksCount >= this._tasks.length) {
      remove(this._loadMoreButtonComponent);
    }
  }
}
