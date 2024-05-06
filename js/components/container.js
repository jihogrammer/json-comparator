"use strict";

import { decodeBase64 } from "../utils/base64.js";
import { comparator } from "../utils/compare.js";
import { COMMAND_COMMENTS } from "../utils/hotkey.js";
import * as QueryParameters from "../utils/params.js";
import { comparison } from "./comparison.js";
import { Textarea } from "./textarea.js";
import { toast } from "./toast.js";

const container = document.getElementById("container");

const handleJSONParsingError = (message, e) => {
  console.error(e);
  const messageDiv = document.createElement("div");
  const edit = document.createElement("a");
  edit.innerText = `"CMD + Enter"`;
  edit.style.color = "blue";
  edit.style.cursor = "pointer";

  messageDiv.innerHTML = `
    <p>${message}</p>
    <p>Please press ${edit.outerHTML}, and edit JSON.</p>
    <br>
    <p style="color: red;">cause: ${e.message}</p>
  `;

  messageDiv.querySelector("a").addEventListener("click", renderEdit);
  container.appendChild(messageDiv);
};

export const renderView = () => {
  QueryParameters.put("mode", "view");
  container.innerHTML = "";

  let asisObject, tobeObject;

  try {
    asisObject = JSON.parse(decodeBase64(QueryParameters.get("asis")));
  } catch(e) {
    handleJSONParsingError("Failed to parse asis JSON string.", e);
    return;
  }

  try {
    tobeObject = JSON.parse(decodeBase64(QueryParameters.get("tobe")));
  } catch(e) {
    handleJSONParsingError("Failed to parse tobe JSON string.", e);
    return;
  }

  try {
    const result = comparator.compare(asisObject, tobeObject);
    const comparisonElement = comparison.render(result);

    container.appendChild(comparisonElement);

    toast(COMMAND_COMMENTS.COMPARE_OR_EDIT, 1000);
  } catch(e) {
    handleJSONParsingError("Failed to compare JSONs.", e);
    return;
  }
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
