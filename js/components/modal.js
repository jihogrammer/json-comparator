export class ModalContainer {
  #element;
  #layerElement;
  #contentsElement;

  constructor(id) {
    this.#element = document.createElement("div");
    this.#element.id = id;
    this.#layerElement = document.createElement("div");
    this.#contentsElement = document.createElement("div");

    this.#init();
  }

  #init() {
    this.#layerElement.style.position = "fixed";
    this.#layerElement.style.top = "0";
    this.#layerElement.style.left = "0";
    this.#layerElement.style.width = "100vw";
    this.#layerElement.style.height = "100vh";
    this.#layerElement.style.backgroundColor = "rgba(255, 255, 255, 50%)";

    this.#contentsElement.style.position = "fixed";
    this.#contentsElement.style.top = "50%";
    this.#contentsElement.style.left = "50%";
    this.#contentsElement.style.minWidth = "50vw";
    this.#contentsElement.style.transform = "translate(-50%, -50%)";
    this.#contentsElement.style.padding = "2rem";
    this.#contentsElement.style.borderRadius = "1rem";
    this.#contentsElement.style.border = "2px solid var(--accent-1-color)";

    this.#layerElement.addEventListener("click", () => this.deactivate());
    document.body.appendChild(this.#element);
  }

  activate = (input) => {
    this.#contentsElement.innerHTML = "";

    if ("string" === typeof(input)) {
      this.#contentsElement.innerHTML = inputHTML;
    } else if (input instanceof HTMLElement) {
      this.#contentsElement.appendChild(input);
    } else {
      return;
    }

    this.#element.appendChild(this.#layerElement);
    this.#element.appendChild(this.#contentsElement);
    this.#element.style.opacity = "1";
    this.#element.style.display = "block";
    document.body.style.overflow = "hidden";
  };

  deactivate = () => {
    this.#element.style.display = "none";
    this.#element.style.opacity = "0";
    document.body.style.overflow = "scroll";
  };
}
