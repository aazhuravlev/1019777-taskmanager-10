import moment from 'moment';

const formatTime = (date) => {
  return moment(date).format(`hh:mm A`);
};

const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
};

const sortTasks = (data, type) => {
  if (type === `date-up`) {
    return data.slice().sort((a, b) => a.dueDate - b.dueDate);
  }
  return data.slice().sort((a, b) => b.dueDate - a.dueDate);
};

export {formatTime, formatDate, sortTasks};
