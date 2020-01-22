import Api from './api/index.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import BoardComponent from './components/board.js';
import BoardController from './controllers/board.js';
import FilterController from './controllers/filter.js';
import SiteMenuComponent, {MenuItem} from './components/site-menu.js';
import StatisticsComponent from './components/statistics.js';
import TasksModel from './models/tasks.js';
import {render, createFragment, RenderPosition} from './utils/render.js';

const STORE_PREFIX = `taskmanager-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const AUTHORIZATION = `Basic dXNlckBwYZFad28yAo=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/task-manager`;

const tasksModel = new TasksModel();

const pasteElements = () => {
  const store = new Store(STORE_NAME, window.localStorage);
  const api = new Api(END_POINT, AUTHORIZATION);
  const apiWithProvider = new Provider(api, store);
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

  const boardController = new BoardController(boardComponent, tasksModel, apiWithProvider);

  statisticsComponent.hide();

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

  apiWithProvider.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(tasks);
    boardController.render();
  });

  window.addEventListener(`load`, () => {
    navigator.serviceWorker.register(`/sw.js`)
      .then(() => {
        // Действие, в случае успешной регистрации ServiceWorker
      }).catch(() => {
        // Действие, в случае ошибки при регистрации ServiceWorker
      });
  });

  window.addEventListener(`online`, () => {
    document.title = document.title.replace(` [offline]`, ``);

    if (!apiWithProvider.getSynchronize()) {
      apiWithProvider.sync()
        .then(() => {
          // Действие, в случае успешной синхронизации
        })
        .catch(() => {
          // Действие, в случае ошибки синхронизации
        });
    }
  });

  window.addEventListener(`offline`, () => {
    document.title += ` [offline]`;
  });
};

pasteElements();
