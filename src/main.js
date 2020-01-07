import BoardComponent from './components/board.js';
import BoardController from './controllers/board.js';
import FilterController from './controllers/filter.js';
import SiteMenuComponent, {MenuItem} from './components/site-menu.js';
import StatisticsComponent from './components/statistics.js';
import TasksModel from './models/tasks.js';
import {generateTasks} from './mock.js';
import {render, createFragment, RenderPosition} from './utils/render.js';

const TASK_COUNT = 22;

const tasks = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const pasteElements = () => {
  const siteMainElement = document.querySelector(`.main`);
  const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
  const siteMenuComponent = new SiteMenuComponent();

  render(siteHeaderElement, siteMenuComponent.getElement(), RenderPosition.BEFOREEND);

  const dateTo = new Date();
  const dateFrom = (() => {
    const d = new Date(dateTo);
    d.setDate(d.getDate() - 7);
    return d;
  })();
  const statisticsComponent = new StatisticsComponent({tasks: tasksModel, dateFrom, dateTo});

  const filterController = new FilterController(siteMainElement, tasksModel);
  filterController.render();

  const boardComponent = new BoardComponent();
  render(siteMainElement, createFragment([boardComponent.getElement(), statisticsComponent.getElement()]), RenderPosition.BEFOREEND);

  const boardController = new BoardController(boardComponent, tasksModel);

  statisticsComponent.hide();
  boardController.render();

  siteMenuComponent.setOnChange((menuItem) => {
    switch (menuItem) {
      case MenuItem.NEW_TASK:
        siteMenuComponent.setActiveItem(MenuItem.TASKS);
        statisticsComponent.hide();
        boardController.show();
        boardController.createTask();
        break;
      case MenuItem.STATISTICS:
        boardController.hide();
        statisticsComponent.show();
        break;
      case MenuItem.TASKS:
        statisticsComponent.hide();
        boardController.show();
        break;
    }
  });
};

pasteElements();
