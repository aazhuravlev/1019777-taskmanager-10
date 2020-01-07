import BoardComponent from './components/board.js';
import BoardController from './controllers/board.js';
import FilterController from './controllers/filter.js';
import SiteMenuComponent from './components/site-menu.js';
import TasksModel from './models/tasks.js';
import {generateTasks} from './mock.js';
import {render, RenderPosition} from './utils/render.js';

const TASK_COUNT = 22;

const tasks = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const pasteElements = () => {
  const siteMainElement = document.querySelector(`.main`);
  const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
  const siteMenuComponent = new SiteMenuComponent();

  render(siteHeaderElement, siteMenuComponent.getElement(), RenderPosition.BEFOREEND);

  const filterController = new FilterController(siteMainElement, tasksModel);
  filterController.render();

  const boardComponent = new BoardComponent();
  render(siteMainElement, boardComponent.getElement(), RenderPosition.BEFOREEND);

  const boardController = new BoardController(boardComponent, tasksModel);
  boardController.render();

  siteMenuComponent.getElement().querySelector(`.control__label--new-task`)
  .addEventListener(`click`, () => {
    boardController.createTask();
  });
};

pasteElements();
