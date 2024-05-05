"use strict";

import { decodeBase64 } from "../utils/base64.js";
import { comparator } from "../utils/compare.js";
import { COMMAND_COMMENTS } from "../utils/hotkey.js";
import * as QueryParameters from "../utils/params.js";
import { comparison } from "./comparison.js";
import { Textarea } from "./textarea.js";
import { toast } from "./toast.js";

const container = document.getElementById("container");

export const renderView = () => {
  QueryParameters.put("mode", "view");
  container.innerHTML = "";

  const asisString = decodeBase64(QueryParameters.get("asis"));
  const tobeString = decodeBase64(QueryParameters.get("tobe"));

  const result = comparator.compare(JSON.parse(asisString), JSON.parse(tobeString));
  const comparisonElement = comparison.render(result);

  console.log(result);

  container.appendChild(comparisonElement);

  toast(COMMAND_COMMENTS.COMPARE_OR_EDIT, 1000);
};

export const renderEdit = () => {
  QueryParameters.put("mode", "edit");
  container.innerHTML = "";

  const asisContainer = document.createElement("section");
  const tobeContainer = document.createElement("section");
  asisContainer.id = "asis-container";
  tobeContainer.id = "tobe-container";

  const asisTextarea = new Textarea("asis");
  const tobeTextarea = new Textarea("tobe");

  asisContainer.appendChild(asisTextarea.element);
  tobeContainer.appendChild(tobeTextarea.element);
  container.appendChild(asisContainer);
  container.appendChild(tobeContainer);

  toast(COMMAND_COMMENTS.COMPARE_OR_EDIT, 1000);
};
