import { initTheme } from "./utils/theme.js";
import { registerHotKeys } from "./utils/hotkey.js";
import { Textarea } from "./components/textarea.js";

window.onload = () => {
  initTheme();

  const asisElement = document.getElementById("asis-container");
  const tobeElement = document.getElementById("tobe-container");

  const asisTextarea = new Textarea("asis");
  const tobeTextarea = new Textarea("tobe");

  asisElement.appendChild(asisTextarea.element);
  tobeElement.appendChild(tobeTextarea.element);

  registerHotKeys();
};
