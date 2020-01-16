import TaskComponent from '../components/task.js';
import TaskEditComponent from '../components/task-edit.js';
import TaskModel from '../models/task.js';
import {render, replace, remove, RenderPosition} from '../utils/render.js';
import {Color, DAYS, KeyName} from '../constants.js';
// import {bindAll} from '../utils/common.js';

const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

const EmptyTask = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    'mo': false,
    'tu': false,
    'we': false,
    'th': false,
    'fr': false,
    'sa': false,
    'su': false,
  },
  tags: [],
  color: Color.BLACK,
  isFavorite: false,
  isArchive: false,
};

const parseFormData = (formData) => {
  const date = formData.get(`date`);
  const repeatingDays = DAYS.reduce((acc, day) => {
    acc[day] = false;
    return acc;
  }, {});

  return new TaskModel({
    'description': formData.get(`text`),
    'due_date': date ? new Date(date) : null,
    'tags': formData.getAll(`hashtag`),
    'repeating_days': formData.getAll(`repeat`).reduce((acc, it) => {
      acc[it] = true;
      return acc;
    }, repeatingDays),
    'color': formData.get(`color`),
    'is_favorite': false,
    'is_done': false,
  });
};

export default class TaskController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._taskComponent = null;
    this._taskEditComponent = null;

    // bindAll(this, [this._onEscKeyDown, this.editButtonClickHandler, this.archiveButtonClickHandler, this.favoritesButtonClickHandler, this.taskEditSubmitHandler, this.dataChangeHandler]);

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this.editButtonClickHandler = this.editButtonClickHandler.bind(this);
    this.archiveButtonClickHandler = this.archiveButtonClickHandler.bind(this);
    this.favoritesButtonClickHandler = this.favoritesButtonClickHandler.bind(this);
    this.taskEditSubmitHandler = this.taskEditSubmitHandler.bind(this);
    this.dataChangeHandler = this.dataChangeHandler.bind(this);
  }

  render(task, mode) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;
    this._mode = mode;
    this.task = task;

    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    this._taskComponent.setEditButtonClickHandler(this.editButtonClickHandler);
    this._taskComponent.setArchiveButtonClickHandler(this.archiveButtonClickHandler);
    this._taskComponent.setFavoritesButtonClickHandler(this.favoritesButtonClickHandler);
    this._taskEditComponent.setSubmitHandler(this.taskEditSubmitHandler);
    this._taskEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, this.task, null));

    switch (mode) {
      case Mode.DEFAULT:
        if (oldTaskEditComponent && oldTaskComponent) {
          replace(this._taskComponent, oldTaskComponent);
          replace(this._taskEditComponent, oldTaskEditComponent);
          this._replaceEditToTask();
        } else {
          render(this._container, this._taskComponent.getElement(), RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldTaskEditComponent && oldTaskComponent) {
          remove(oldTaskComponent);
          remove(oldTaskEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._taskEditComponent.getElement(), RenderPosition.AFTERBEGIN);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  destroy() {
    remove(this._taskEditComponent);
    remove(this._taskComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceEditToTask() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._taskEditComponent.reset();

    if (document.contains(this._taskEditComponent.getElement())) {
      replace(this._taskComponent, this._taskEditComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  _replaceTaskToEdit() {
    this._onViewChange();

    replace(this._taskEditComponent, this._taskComponent);
    this._mode = Mode.EDIT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === KeyName.ESCAPE || evt.key === KeyName.ESC;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyTask, null);
      }
      this._replaceEditToTask();
    }
  }

  editButtonClickHandler() {
    this._replaceTaskToEdit();
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  archiveButtonClickHandler() {
    this.dataChangeHandler(`isArchive`);
  }

  favoritesButtonClickHandler() {
    this.dataChangeHandler(`isFavorite`);
  }

  taskEditSubmitHandler(evt) {
    evt.preventDefault();
    const formData = this._taskEditComponent.getData();
    const data = parseFormData(formData);

    this._onDataChange(this, this.task, data);
  }

  dataChangeHandler(property) {
    const newTask = TaskModel.clone(this.task);
    newTask[property] = !newTask[property];
    this._onDataChange(this, this.task, newTask);
  }
}

export {Mode, EmptyTask};
