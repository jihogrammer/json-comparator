import { activateDarkTheme, activateLightTheme } from "./theme.js";
import { toast } from "../components/toast.js";

const SPECIAL_KEYS = Object.freeze(["Meta"]);
const keymap = {};

export const COMMAND_COMMENTS = Object.freeze({
  HELP: "CMD + H help",
  INDENTATION: "CMD + I Indentation",
  DARK_THEME: "CMD + D Dark Theme",
  LIGHT_THEME: "CMD + L Light Theme",
});

const HELP_FEATURE_ELEMENTS = Object.values(COMMAND_COMMENTS).map((text) => {
  const element = document.createElement("p");

  element.style.padding = "0.5rem";
  element.innerText = text;

  return element;
});

const toastHelp = () => {
  const helpContainer = document.createElement("div");

  for (const featureElement of HELP_FEATURE_ELEMENTS) {
    helpContainer.appendChild(featureElement);
  }

  toast(helpContainer.innerHTML, 1500);
};

export const registerHotKeys = () => {
  window.addEventListener("keydown", (e) => {
    if (SPECIAL_KEYS.includes(e.key)) {
      keymap[e.key] = true;
    }

    if (keymap["Meta"]) {
      switch (e.key) {
        case "h":
          e.preventDefault();
          toastHelp();
          break;
        case "d":
          e.preventDefault();
          activateDarkTheme();
          break;
        case "l":
          e.preventDefault();
          activateLightTheme();
          break;
      }
    }
  });

  window.addEventListener("keyup", (e) => {
    if (SPECIAL_KEYS.includes(e.key)) {
      keymap[e.key] = false;
    }
  });
};
