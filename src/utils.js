const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

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

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export {formatTime, RenderPosition, createElement, render};
