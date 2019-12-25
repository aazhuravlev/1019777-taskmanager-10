import AbstractComponent from './abstract-component.js';

export const SortType = {
  DEFAULT: [`default`, `SORT BY DEFAULT`],
  DATE_UP: [`date-up`, `SORT BY DATE up`],
  DATE_DOWN: [`date-down`, `SORT BY DATE down`]
};

const generateSortButtons = (sortType) => {
  return Object.values(sortType).map(([type, name]) => {
    return `
    <a href="#" data-sort-type="${type}" class="board__filter">${name}</a>
    `;
  }).join(`\n`);
};

const createSortTemplate = () => {
  return (
    `<div class="board__filter-list">
      ${generateSortButtons(SortType)}
    </div>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._currenSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate();
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }
      const sortType = evt.target.dataset.sortType;

      if (this._currenSortType === sortType) {
        return;
      }

      this._currenSortType = sortType;

      handler(this._currenSortType);
    });
  }
}
