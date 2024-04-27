const THEME = "theme";
const LIGHT_THEME = "light";
const DARK_THEME = "dark";
const THEME_CHECKBOX_ELEMENT_ID = "theme-checkbox";

const getUserTheme = () => {
  const userTheme = localStorage.getItem(THEME);

  if (LIGHT_THEME === userTheme) {
    return LIGHT_THEME;
  }
  if (DARK_THEME === userTheme) {
    return DARK_THEME;
  }
  return null;
};

const getOSTheme = () => {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? LIGHT_THEME : DARK_THEME;
};

const checkbox = () => document.getElementById(THEME_CHECKBOX_ELEMENT_ID);

const activateLightTheme = () => {
  localStorage.setItem(THEME, LIGHT_THEME);
  document.documentElement.setAttribute(THEME, LIGHT_THEME);
  checkbox().checked = false;
};

const activateDarkTheme = () => {
  localStorage.setItem(THEME, DARK_THEME);
  document.documentElement.setAttribute(THEME, DARK_THEME);
  checkbox().checked = true;
};

export const initThemeChager = () => {
  const theme = getUserTheme() || getOSTheme();

  if (LIGHT_THEME === theme) {
    activateLightTheme();
  } else {
    activateDarkTheme();
  }

  checkbox().addEventListener("click", (event) => {
    if (event.target.checked) {
      activateDarkTheme();
    } else {
      activateLightTheme();
    }
  });
};
