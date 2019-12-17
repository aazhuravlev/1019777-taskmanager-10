const castTimeFormat = (value) => {
  return value < 10 ? `${String(value).padStart(2, 0)}` : String(value);
};

const formatTime = (date) => {
  const hour = date.getHours();
  const hours = castTimeFormat(hour % 12);
  const minutes = castTimeFormat(date.getMinutes());

  const interval = hour > 11 ? `pm` : `am`;

  return `${hours}:${minutes} ${interval}`;
};

const sortTasks = (data, type) => {
  if (type === `date-up`) {
    return data.slice().sort((a, b) => a.dueDate - b.dueDate);
  } else {
    return data.slice().sort((a, b) => b.dueDate - a.dueDate);
  }
};

export {formatTime, sortTasks};
