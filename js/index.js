import { initTheme } from "./utils/theme.js";
import { registerHotKeys } from "./utils/hotkey.js";
import * as QueryParameters from "./utils/params.js";
import { renderEdit, renderView } from "./components/container.js";


window.onload = () => {
  initTheme();
  registerHotKeys();

  if ("view" === QueryParameters.get("mode")) {
    renderView();
  } else {
    renderEdit();
  }
};
