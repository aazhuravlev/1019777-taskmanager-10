import flatpickr from 'flatpickr';
import he from 'he';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';
import AbstractSmartComponent from './abstract-smart-component.js';
import {COLORS, DAYS} from '../constants.js';
import {formatTime, formatDate, isRepeating, isOverdueDate} from '../utils/common.js';

const MIN_DESCRIPTION_LENGTH = 1;
const MAX_DESCRIPTION_LENGTH = 140;

const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
};

const isAllowableDescriptionLength = (description) => {
  const length = description.length;

  return length >= MIN_DESCRIPTION_LENGTH &&
    length <= MAX_DESCRIPTION_LENGTH;
};

const createColorsMarkup = (colors, currentColor) => {
  return colors
    .map((color) => {
      return (
        `<input
          type="radio"
          id="color-${color}-4"
          class="card__color-input card__color-input--${color} visually-hidden"
          name="color"
          value="${color}"
          ${currentColor === color ? `checked` : ``}
        />
        <label
          for="color-${color}-4"
          class="card__color card__color--${color}"
          >${color}</label
        >`
      );
    })
    .join(`\n`);
};

const createRepeatingDaysMarkup = (days, repeatingDays) => {
  return days
    .map((day) => {
      return (
        `<input
          class="visually-hidden card__repeat-day-input"
          type="checkbox"
          id="repeat-${day}-4"
          name="repeat"
          value="${day}"
          ${repeatingDays[day] ? `checked` : ``}
        />
        <label class="card__repeat-day" for="repeat-${day}-4"
          >${day}</label
        >`
      );
    })
    .join(`\n`);
};

const createHashtags = (tags) => {
  return Array.from(tags)
    .map((tag) => {
      return (
        `<span class="card__hashtag-inner">
          <input
            type="hidden"
            name="hashtag"
            value="${tag}"
            class="card__hashtag-hidden-input"
          />
          <p class="card__hashtag-name">
            #${tag}
          </p>
          <button
            type="button"
            class="card__hashtag-delete"
          >
            delete
          </button>
        </span>`
      );
    })
    .join(`\n`);
};

const setdateShowing = (dateFlag, date, time) => {
  return dateFlag ?
    `<fieldset class="card__date-deadline">
      <label class="card__input-deadline-wrap">
        <input
        class="card__date"
        type="text"
        placeholder=""
        name="date"
        value="${date} ${time}"/>
       </label>
    </fieldset>` :
    ``;
};

const setRepeatingTask = (repeatingTaskFlag, markup) => {
  return repeatingTaskFlag ?
    `<fieldset class="card__repeat-days">
      <div class="card__repeat-days-inner">
        ${markup}
      </div>
    </fieldset>` :
    ``;
};

const createTaskEditTemplate = (task, options = {}) => {
  const {tags, dueDate, color} = task;
  const {isDateShowing, isRepeatingTask, activeRepeatingDays, currentDescription, externalData} = options;

  const description = he.encode(currentDescription);

  const isExpired = dueDate instanceof Date && isOverdueDate(dueDate, new Date());
  const isBlockSaveButton = (isDateShowing && isRepeatingTask) || (isRepeatingTask && !isRepeating(activeRepeatingDays)) || !isAllowableDescriptionLength(description);

  const date = (isDateShowing && dueDate) ? formatDate(dueDate) : ``;
  const time = (isDateShowing && dueDate) ? formatTime(dueDate) : ``;

  const repeatClass = isRepeatingTask ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;
  const tagsMarkup = createHashtags(tags);
  const colorsMarkup = createColorsMarkup(COLORS, color);
  const repeatingDaysMarkup = createRepeatingDaysMarkup(DAYS, activeRepeatingDays);

  const deleteButtonText = externalData.deleteButtonText;
  const saveButtonText = externalData.saveButtonText;

  return (
    `<article class="card card--edit card--${color} ${repeatClass} ${deadlineClass}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${isDateShowing ? `yes` : `no`}</span>
                </button>
                ${setdateShowing(isDateShowing, date, time)}
              <button class="card__repeat-toggle" type="button">
                repeat:<span class="card__repeat-status">${isRepeatingTask ? `yes` : `no`}</span>
              </button>
                ${setRepeatingTask(isRepeatingTask, repeatingDaysMarkup)}
              </div>
              <div class="card__hashtag">
                <div class="card__hashtag-list">
                  ${tagsMarkup}
                </div>
                <label>
                  <input
                    type="text"
                    class="card__hashtag-input"
                    name="hashtag-input"
                    placeholder="Type new hashtag here"
                  />
                  </label>
                </div>
              </div>
              <div class="card__colors-inner">
                <h3 class="card__colors-title">Color</h3>
                <div class="card__colors-wrap">
                  ${colorsMarkup}
                </div>
              </div>
            </div>
            <div class="card__status-btns">
              <button class="card__save" type="submit" ${isBlockSaveButton ? `disabled` : ``}>${saveButtonText}</button>
              <button class="card__delete" type="button">${deleteButtonText}</button>
            </div>
          </div>
        </form>
      </article>`
  );
};

export default class TaskEdit extends AbstractSmartComponent {
  constructor(task) {
    super();
    this._task = task;
    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._currentDescription = task.description;
    this._externalData = DefaultData;

    this._flatpickr = null;
    this._submitHandler = null;
    this._deleteButtonClickHandler = null;

    this.deadlineToggleClickHandler = this.deadlineToggleClickHandler.bind(this);
    this.repeatToggleClickHandler = this.repeatToggleClickHandler.bind(this);
    this.repeatDaysChangeHandler = this.repeatDaysChangeHandler.bind(this);
    this.cartTextChangeHandler = this.cartTextChangeHandler.bind(this);

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createTaskEditTemplate(this._task, {
      isDateShowing: this._isDateShowing,
      isRepeatingTask: this._isRepeatingTask,
      externalData: this._externalData,
      activeRepeatingDays: this._activeRepeatingDays,
      currentDescription: this._currentDescription
    });
  }

  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    super.removeElement();
  }

  recoverListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  reset() {
    const task = this._task;

    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._currentDescription = task.description;

    this.rerender();
  }

  getData() {
    const form = this.getElement().querySelector(`.card__form`);

    return new FormData(form);
  }

  deadlineToggleClickHandler() {
    this._isDateShowing = !this._isDateShowing;

    this.rerender();
  }

  repeatToggleClickHandler() {
    this._isRepeatingTask = !this._isRepeatingTask;

    this.rerender();
  }

  repeatDaysChangeHandler(evt) {
    this._activeRepeatingDays[evt.target.value] = evt.target.checked;

    this.rerender();
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`)
      .addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__delete`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  cartTextChangeHandler(evt) {
    this._currentDescription = evt.target.value;

    const saveButton = this.getElement().querySelector(`.card__save`);
    saveButton.disabled = !isAllowableDescriptionLength(this._currentDescription);
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }
    if (this._isDateShowing) {

      const dateElement = this.getElement().querySelector(`.card__date`);
      this._flatpickr = flatpickr(dateElement, {
        altInput: true,
        allowInput: true,
        defaultDate: this._task.dueDate,
      });
    }
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.card__text`)
      .addEventListener(`input`, this.cartTextChangeHandler);

    element.querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, this.deadlineToggleClickHandler);

    element.querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, this.repeatToggleClickHandler);

    const repeatDays = element.querySelector(`.card__repeat-days`);
    if (repeatDays) {
      repeatDays.addEventListener(`change`, this.repeatDaysChangeHandler);
    }
  }
}
