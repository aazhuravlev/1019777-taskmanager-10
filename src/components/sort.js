import AbstractComponent from './abstract-component.js';

export const SortType = {
  DEFAULT: [`default`, `SORT BY DEFAULT`],
  DATE_UP: [`date-up`, `SORT BY DATE up`],
  DATE_DOWN: [`date-down`, `SORT BY DATE down`]
};

const SortTypeIndex = {
  DATA: `0`,
  NAME: `1`
};

const generateSortButtons = (sortType) => {
  const buttons = [];
  for (const type of Object.keys(sortType)) {
    buttons.push(`<a href="#" data-sort-type="${SortType[type][SortTypeIndex.DATA]}" class="board__filter">${SortType[type][SortTypeIndex.NAME]}</a>`);
  }
  return buttons.join(`\n`);
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
