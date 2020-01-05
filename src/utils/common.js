import moment from 'moment';

const DATE_UP_SORT_TYPE = `date-up`;

const formatTime = (date) => {
  return moment(date).format(`hh:mm A`);
};

const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
};

const sortTasks = (data, type) => {
  if (type === DATE_UP_SORT_TYPE) {
    return data.slice().sort((a, b) => a.dueDate - b.dueDate);
  }
  return data.slice().sort((a, b) => b.dueDate - a.dueDate);
};

const isRepeating = (repeatingDays) => {
  return Object.values(repeatingDays).some(Boolean);
};

const isOverdueDate = (dueDate, date) => {
  return dueDate < date && !isOneDay(date, dueDate);
};

const isOneDay = (dateA, dateB) => {
  const a = moment(dateA);
  const b = moment(dateB);
  return a.diff(b, `days`) === 0 && dateA.getDate() === dateB.getDate();
};

// const bindAll = (context, handlers) => {
//   handlers.forEach((handler) => handler = handler.bind(context));
// };

export {formatTime, formatDate, sortTasks, isRepeating, isOverdueDate, isOneDay};
