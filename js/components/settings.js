import { ModalContainer } from "./modal.js";
import * as Title from "./title.js";

const GOLDEN_RATIO = 1.61803398875;
const STORE_KEY = "settings";

const FONT_SIZE_DEFAULT_VALUE = 14;
const FONT_SIZE_MIN_VALUE = 10;
const FONT_SIZE_MAX_VALUE = 30;

class SettingsConfig {
  /** @type {number} */
  #fontSize;

  constructor() {
    const storedSettingsValue = localStorage.getItem(STORE_KEY);
    const storedSettings = storedSettingsValue
      ? JSON.parse(storedSettingsValue)
      : {};

    this.fontSize =
      parseInt(storedSettings.fontSize) || FONT_SIZE_DEFAULT_VALUE;
  }

  /**
   * @param {{ fontSize: number; }} command
   */
  save = (command) => {
    this.fontSize = command.fontSize;

    localStorage.setItem(
      STORE_KEY,
      JSON.stringify({
        fontSize: this.fontSize,
      })
    );
  };

  get fontSize() {
    return this.#fontSize;
  }

  set fontSize(value) {
    if (FONT_SIZE_MIN_VALUE <= value || value <= FONT_SIZE_MAX_VALUE) {
      this.#fontSize = value;
      return;
    }
    throw new Error(`fontSize value is not valid - "${value}"`);
  }
}

class SettingsStyleRenderer {
  #element;

  constructor() {
    this.#element = document.createElement("style");
    this.#element.id = `settings-style-${crypto.randomUUID()}`;

    document.body.appendChild(this.#element);
  }

  /**
   * @param {{ config: SettingsConfig; }} props
   * @returns Command Container HTML Element
   */
  render = ({ config }) => {
    this.#element.innerHTML = `
      #container > section textarea {
        font-size: ${config.fontSize}px;
        line-height: calc(${config.fontSize}px * ${GOLDEN_RATIO});
      }
      #container table pre {
        font-size: ${config.fontSize}px;
        line-height: calc(${config.fontSize}px * ${GOLDEN_RATIO});
      }
    `;
  };
}

/**
 * @param {{ command: { fontSize: number; }; }} props
 * @returns Font Container HTML Element
 */
const createFontContainer = ({ command }) => {
  const element = document.createElement("div");
  element.style.display = "flex";
  element.style.flexDirection = "row";
  element.style.justifyContent = "center";
  element.style.gap = "0.5rem";

  const fontLabel = document.createElement("label");
  fontLabel.innerText = "font size";

  const fontValue = document.createElement("p");
  fontValue.innerText = `${command.fontSize}px`;

  const fontInput = document.createElement("input");
  fontInput.type = "range";
  fontInput.step = "1";
  fontInput.min = FONT_SIZE_MIN_VALUE;
  fontInput.max = FONT_SIZE_MAX_VALUE;
  fontInput.value = command.fontSize;
  fontInput.addEventListener("input", (e) => {
    command.fontSize = e.target.value;
    fontValue.innerText = `${command.fontSize}px`;
  });

  element.appendChild(fontLabel);
  element.appendChild(fontValue);
  element.appendChild(fontInput);

  return element;
};

/**
 * @param {{ command: { fontSize: number; }; config: SettingsConfig; toggle: () => void; }} props
 * @returns Command Container HTML Element
 */
const createCommandContainer = ({ command, config, toggle }) => {
  const element = document.createElement("div");
  element.style.display = "flex";
  element.style.flexDirection = "row";
  element.style.justifyContent = "center";
  element.style.gap = "1rem";
  element.style.width = "100%";

  const saveButton = document.createElement("button");
  saveButton.innerText = "SAVE";
  saveButton.style.backgroundColor = "var(--accent-1-color)";
  saveButton.style.color = "white";
  saveButton.style.padding = "0.5rem";
  saveButton.style.width = "40%";
  saveButton.addEventListener("click", () => {
    config.save(command);
    toggle();
  });

  const cancelButton = document.createElement("button");
  cancelButton.innerText = "CANCEL";
  cancelButton.style.backgroundColor = "gray";
  cancelButton.style.color = "white";
  cancelButton.style.padding = "0.5rem";
  cancelButton.style.width = "40%";
  cancelButton.addEventListener("click", () => toggle());

  element.appendChild(saveButton);
  element.appendChild(cancelButton);

  return element;
};

export class Settings {
  #config;
  #styleRenderer;
  #modalContainer;
  #active;

  constructor() {
    this.#config = new SettingsConfig();
    this.#styleRenderer = new SettingsStyleRenderer();
    this.#modalContainer = new ModalContainer("settings");
    this.#active = false;

    this.#applySettings();
  }

  toggle = () => {
    if (this.#active) {
      this.#modalContainer.deactivate();
    } else {
      this.#modalContainer.activate(this.#create());
    }
    this.#applySettings();
    this.#active = !this.#active;
  };

  #applySettings = () => {
    this.#styleRenderer.render({ config: this.#config });
  };

  #create = () => {
    const element = document.createElement("div");
    element.style.display = "flex";
    element.style.flexDirection = "column";
    element.style.alignItems = "center";
    element.style.gap = "1rem";

    const command = {
      fontSize: this.#config.fontSize,
    };

    element.appendChild(Title.h2("Settings"));
    element.appendChild(createFontContainer({ command }));
    element.appendChild(
      createCommandContainer({
        config: this.#config,
        command: command,
        toggle: this.toggle,
      })
    );

    return element;
  };
}
