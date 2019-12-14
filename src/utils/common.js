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

export {formatTime};
