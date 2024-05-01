import { decodeBase64, encodeBase64 } from "../base64.js";
import * as QueryParameters from "../utils/params.js";
import { toast } from "./toast.js";

const SPECIAL_KEYS = Object.freeze(["Meta"]);

export class Textarea {
  #element
  #keymap = {};

  constructor(id) {
    this.#element = document.createElement("textarea");
    this.#element.id = id;
    this.#init();
  }

  get element() {
    return this.#element;
  }

  #updateQueryParams = (value) => {
    QueryParameters.put(this.element.id, encodeBase64(value));
  };

  #init = () => {
    this.element.addEventListener("focusout", (e) => {
      e.preventDefault();
      this.#updateQueryParams(e.target.value);
    });

    this.element.addEventListener("keydown", (event) => {
      if (SPECIAL_KEYS.includes(event.key)) {
        this.#keymap[event.key] = true;
      }

      if ("Tab" === event.key) {
        event.preventDefault();
        document.execCommand("insertText", false, "  ");
      }

      if (this.#keymap["Meta"] && "i" === event.key) {
        toast("CMD + I - indentation", 1000);

        const object = JSON.parse(event.target.value);
        const defaultJSONString = JSON.stringify(object);

        if (defaultJSONString === event.target.value) {
          event.target.value = JSON.stringify(object, null, 2);
        } else {
          event.target.value = defaultJSONString;
        }
      }
    });

    this.element.addEventListener("keyup", (event) => {
      if (SPECIAL_KEYS.includes(event.key)) {
        this.#keymap[event.key] = false;
      }
    });

    const beforeValue = QueryParameters.get(this.element.id);

    if (beforeValue) {
      this.element.value = decodeBase64(beforeValue);
    } else {
      this.element.value = "{}";
    }

    this.#updateQueryParams(this.element.value);
  };
}
