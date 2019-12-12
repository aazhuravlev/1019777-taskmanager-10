import BoardComponent from './components/board.js';
import BoardController from './controllers/board.js';
import FilterComponent from './components/filter.js';
import SiteMenuComponent from './components/site-menu.js';
import {generateTasks, generateFilters} from './mock.js';
import {render, RenderPosition} from './utils/render.js';

const TASK_COUNT = 22;

const filters = generateFilters();
const tasks = generateTasks(TASK_COUNT);

const pasteElements = () => {
  const siteMainElement = document.querySelector(`.main`);
  const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
  render(siteHeaderElement, new SiteMenuComponent().getElement(), RenderPosition.BEFOREEND);
  render(siteMainElement, new FilterComponent(filters, 0).getElement(), RenderPosition.BEFOREEND);

  const boardComponent = new BoardComponent();
  render(siteMainElement, boardComponent.getElement(), RenderPosition.BEFOREEND);

  const boardController = new BoardController(boardComponent);
  boardController.render(tasks);
};

pasteElements();
