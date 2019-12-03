import {createElement} from '../utils.js';

const createFilterMarkup = (filter, isChecked) => {
  const {name, count} = filter;

  return (
    `<input
        type="radio"
        id="filter__${name}"
        class="filter__input visually-hidden"
        name="filter"
        ${isChecked ? `checked` : ``}
      />
      <label for="filter__${name}" class="filter__label">
        ${name} <span class="filter__${name}-count">${count}</span>
      </label>`
  );
};

const createFilterTemplate = (filters, action) => {
  const filtersMarkup = filters.map((item, i) => createFilterMarkup(item, i === action)).join(`\n`);

  return (
    `<section class="main__filter filter container">
      ${filtersMarkup}
    </section>`
  );
};

class Filter {
  constructor(filters, action) {
    this._filters = filters;
    this._action = action;
    this._element = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._action);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default Filter;
