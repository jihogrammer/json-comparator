const updateURL = (urlSearchParams) => {
  if (history.pushState) {
    const url = `${window.location.protocol}//${window.location.host}${window.location.pathname === "/" ? "" : window.location.pathname}?${urlSearchParams}`;
    console.log(url);
    window.history.pushState({path: url}, '', url);
  }
};

export const get = (key) => new URLSearchParams(window.location.search).get(key);

export const put = (key, value) => {
  const params = new URLSearchParams(window.location.search);

  params.set(key, value);
  updateURL(params);
};
