"use strict";

import { decodeBase64, encodeBase64 } from "../utils/base64.js";
import { COMMAND_COMMENTS, isKeyDownFuction } from "../utils/hotkey.js";
import * as QueryParameters from "../utils/params.js";
import { toast } from "./toast.js";

export class Textarea {
  #element

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
      if (isKeyDownFuction() && "i" === event.key) {
        toast(COMMAND_COMMENTS.INDENTATION, 1000);

        const object = JSON.parse(event.target.value);
        const defaultJSONString = JSON.stringify(object);

        if (defaultJSONString === event.target.value) {
          event.target.value = JSON.stringify(object, null, 2);
        } else {
          event.target.value = defaultJSONString;
        }
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
