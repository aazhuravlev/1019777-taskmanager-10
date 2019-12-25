import TaskComponent from '../components/task.js';
import TaskEditComponent from '../components/task-edit.js';
import {render, replace, RenderPosition} from '../utils/render.js';

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};


export default class TaskController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._taskComponent = null;
    this._taskEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this.editButtonClickHandler = this.editButtonClickHandler.bind(this);
    this.archiveButtonClickHandler = this.archiveButtonClickHandler.bind(this);
    this.favoritesButtonClickHandler = this.favoritesButtonClickHandler.bind(this);
    this.taskEditSubmitHandler = this.taskEditSubmitHandler.bind(this);
  }

  render(task) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;

    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    this._taskComponent.setEditButtonClickHandler(this.editButtonClickHandler);

    this._taskComponent.setArchiveButtonClickHandler(this.archiveButtonClickHandler(task));

    this._taskComponent.setFavoritesButtonClickHandler(this.favoritesButtonClickHandler(task));

    this._taskEditComponent.setSubmitHandler(this.taskEditSubmitHandler);

    if (oldTaskEditComponent && oldTaskComponent) {
      replace(this._taskComponent, oldTaskComponent);
      replace(this._taskEditComponent, oldTaskEditComponent);
    } else {
      render(this._container, this._taskComponent.getElement(), RenderPosition.BEFOREEND);
    }
  }

  editButtonClickHandler() {
    this._replaceTaskToEdit();
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  archiveButtonClickHandler(task) {
    return () => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isArchive: !task.isArchive,
      }));
    };
  }

  favoritesButtonClickHandler(task) {
    return () => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isFavorite: !task.isFavorite,
      }));
    };
  }

  taskEditSubmitHandler() {
    this._replaceEditToTask();
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  _replaceEditToTask() {
    this._taskEditComponent.reset();

    replace(this._taskComponent, this._taskEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _replaceTaskToEdit() {
    this._onViewChange();

    replace(this._taskEditComponent, this._taskComponent);
    this._mode = Mode.EDIT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
