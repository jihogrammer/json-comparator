import { initTheme } from "./utils/theme.js";
import { registerHotKeys } from "./utils/hotkey.js";
import { Textarea } from "./components/textarea.js";

window.onload = () => {
  initTheme();

  const asisContainer = document.getElementById("asis-container");
  const tobeContainer = document.getElementById("tobe-container");

  const asisTextarea = new Textarea("asis");
  const tobeTextarea = new Textarea("tobe");

  asisContainer.appendChild(asisTextarea.element);
  tobeContainer.appendChild(tobeTextarea.element);

  registerHotKeys();
};
