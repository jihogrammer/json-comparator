"use strict";

import { toast } from "../components/toast.js";
import { COMMAND_COMMENTS } from "./hotkey.js";

const THEME = "theme";
const DARK_THEME = "dark";
const LIGHT_THEME = "light";

export const activateLightTheme = () => {
  localStorage.setItem(THEME, LIGHT_THEME);
  document.documentElement.setAttribute(THEME, LIGHT_THEME);
  toast(COMMAND_COMMENTS.LIGHT_THEME, 1000);
};

export const activateDarkTheme = () => {
  localStorage.setItem(THEME, DARK_THEME);
  document.documentElement.setAttribute(THEME, DARK_THEME);
  toast(COMMAND_COMMENTS.DARK_THEME, 1000);
};

export const initTheme = () => {
  const getOSTheme = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? DARK_THEME
      : LIGHT_THEME;
  };

  const theme = localStorage.getItem(THEME) || getOSTheme();

  if (DARK_THEME === theme) {
    activateDarkTheme();
  } else {
    activateLightTheme();
  }

  document.getElementById(THEME).addEventListener("click", () => {
    if (DARK_THEME === document.documentElement.getAttribute(THEME)) {
      activateLightTheme();
    } else {
      activateDarkTheme();
    }
  });
};
