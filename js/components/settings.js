import { modalContainer } from "./modal.js";

const GOLDEN_RATIO = 1.61803398875;
const STORE_KEY = "settings";

export class Settings {
  #styleElement;
  #fontSize;
  #active;

  constructor() {
    const storedSettingsValue = localStorage.getItem(STORE_KEY);
    const storedSettings = storedSettingsValue ? JSON.parse(storedSettingsValue) : {};

    this.#styleElement = document.createElement("style");
    this.#active = false;
    this.fontSize = storedSettings.fontSize || "14px";

    document.body.appendChild(this.#styleElement);
    this.#render();
  }

  #render = () => {
    this.#styleElement.innerHTML = `
      #container > section textarea {
        font-size: ${this.fontSize};
        line-height: calc(${this.fontSize} * ${GOLDEN_RATIO});
      }
    `;
  }

  #save = () => {
    localStorage.setItem(STORE_KEY, JSON.stringify({
      fontSize: this.#fontSize,
    }));
  }

  toggle = () => {
    if (this.#active) {
      modalContainer.deactivate();
    } else {
      modalContainer.activate(this.element);
    }
    this.#save();
    this.#render();
    this.#active = !this.#active;
  };

  get element() {
    const element = document.createElement("div");
    const command = {
      fontSize: parseInt(this.#fontSize.substring(0, 2)),
    };

    element.style.display = "flex";
    element.style.flexDirection = "column";
    element.style.alignItems = "center";
    element.style.gap = "1rem";

    const title = document.createElement("h2");
    title.innerText = "Settings";
    element.appendChild(title);

    const fontContainer = document.createElement("div");
    fontContainer.style.display = "flex";
    fontContainer.style.flexDirection = "row";
    fontContainer.style.justifyContent = "center";
    fontContainer.style.gap = "0.5rem";

    const fontLabel = document.createElement("label");
    fontLabel.innerText = "font size"

    const fontValue = document.createElement("p");
    fontValue.innerText = `${command.fontSize}px`;

    const fontInput = document.createElement("input");
    fontInput.type = "range";
    fontInput.step = "1";
    fontInput.min = "10";
    fontInput.max = "30";
    fontInput.value = command.fontSize;
    fontInput.addEventListener("input", (e) => {
      command.fontSize = e.target.value;
      fontValue.innerText = `${command.fontSize}px`;
    });

    fontContainer.appendChild(fontLabel);
    fontContainer.appendChild(fontValue);
    fontContainer.appendChild(fontInput);
    element.appendChild(fontContainer);

    const commandContainer = document.createElement("div");
    commandContainer.style.display = "flex";
    commandContainer.style.flexDirection = "row";
    commandContainer.style.justifyContent = "center";
    commandContainer.style.gap = "1rem";
    commandContainer.style.width = "100%";

    const saveButton = document.createElement("button");
    saveButton.innerText = "SAVE";
    saveButton.style.backgroundColor = "var(--accent-1-color)";
    saveButton.style.color = "white";
    saveButton.style.padding = "0.5rem";
    saveButton.style.width = "40%";
    saveButton.addEventListener("click", () => {
      this.#fontSize = `${command.fontSize}px`;
      this.toggle();
    });

    const cancelButton = document.createElement("button");
    cancelButton.innerText = "CANCEL";
    cancelButton.style.backgroundColor = "gray";
    cancelButton.style.color = "white";
    cancelButton.style.padding = "0.5rem";
    cancelButton.style.width = "40%";
    cancelButton.addEventListener("click", () => this.toggle());

    commandContainer.appendChild(saveButton);
    commandContainer.appendChild(cancelButton);
    element.appendChild(commandContainer);

    return element;
  }

  get fontSize() {
    return this.#fontSize;
  }

  set fontSize(value) {
    this.#fontSize = value;
  }
}
