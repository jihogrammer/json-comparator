const simpleTitle = (level, text) => {
  const title = document.createElement(level);
  title.innerText = text;
  return title;
}

export const h1 = (text) => simpleTitle("h1", text);
export const h2 = (text) => simpleTitle("h2", text);
export const h3 = (text) => simpleTitle("h3", text);
