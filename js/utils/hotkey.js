"use strinct";

import { toast } from "../components/toast.js";
import { Settings } from "../components/settings.js";
import { renderEdit, renderView } from "../components/container.js";
import { activateDarkTheme, activateLightTheme } from "./theme.js";
import * as QueryParameters from "./params.js";

const settings = new Settings();
const SPECIAL_KEYS = Object.freeze(["Meta", "Control"]);
const keymap = {};

export const isKeyDownFuction = () => keymap["Meta"] || keymap["Control"];

export const COMMAND_COMMENTS = Object.freeze({
  HELP: "[CMD + H] help",
  INDENTATION: "[CMD + I] Indentation",
  DARK_THEME: "[CMD + D] Dark Theme",
  LIGHT_THEME: "[CMD + L] Light Theme",
  SETTINGS: "[CMD + ,] Settings",
  COMPARE_OR_EDIT: "[CMD + Enter] Compare or Edit",
});

const toastHelp = () => {
  const container = document.createElement("div");

  for (const key in COMMAND_COMMENTS) {
    const featureElement = document.createElement("p");

    featureElement.style.padding = "0.5rem";
    featureElement.innerText = COMMAND_COMMENTS[key];

    container.appendChild(featureElement);
  }

  toast(container.innerHTML, 1500);
};

export const registerHotKeys = () => {
  window.addEventListener("keydown", (e) => {
    if (SPECIAL_KEYS.includes(e.key)) {
      keymap[e.key] = true;
    }

    if (isKeyDownFuction()) {
      console.log(e.key);
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
        case ",":
          e.preventDefault();
          settings.toggle();
          break;
        case "Enter":
          if ("view" === QueryParameters.get("mode")) {
            renderEdit();
          } else {
            renderView();
          }
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
