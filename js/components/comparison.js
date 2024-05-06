"use strict";

import { ValueType, DiffType } from "../utils/compare.js";

const BACKGROUND_COLOR_RED = "rgba(255, 0, 0, 33%)";
const BACKGROUND_COLOR_GREEN = "rgba(0, 255, 0, 33%)";
const BACKGROUND_COLOR_YELLOW = "rgba(255, 255, 0, 33%)";

class Comparison {
  #element;
  #asisTable;
  #tobeTable;
  #asisLineNumber;
  #tobeLineNumber;

  constructor() {
    this.#element = document.createElement("div");
    this.#element.id = `comparison-${crypto.randomUUID()}`;
    this.#element.style.display = "flex";
    this.#element.style.flexDirection = "row";
    this.#element.style.justifyContent = "center";

    this.#asisTable = document.createElement("table");
    this.#asisTable.style.width = "40vw";
    const asisContainer = document.createElement("div");
    asisContainer.appendChild(this.#asisTable);

    this.#tobeTable = document.createElement("table");
    this.#tobeTable.style.width = "40vw";
    const tobeContainer = document.createElement("div");
    tobeContainer.appendChild(this.#tobeTable);

    this.#element.appendChild(asisContainer);
    this.#element.appendChild(tobeContainer);
  }

  render = (report) => {
    this.#asisTable.innerHTML = "";
    this.#tobeTable.innerHTML = "";
    this.#asisLineNumber = 0;
    this.#tobeLineNumber = 0;

    this.#render(report, 0, null, null, report.value);

    return this.#element;
  };

  #render = (record, depth, prevRecord, nextRecord, list) => {
    if (ValueType.SCALAR === record.valueType) {
      if (DiffType.DELETED === record.diffType) {
        this.#createRowElement(record.key, [record.value, null], depth, prevRecord, nextRecord, list);
      } else if (DiffType.CREATED === record.diffType) {
        this.#createRowElement(record.key, [null, record.value], depth, prevRecord, nextRecord, list);
      } else {
        this.#createRowElement(record.key, record.value, depth, prevRecord, nextRecord, list);
      }
    } else {
      if (DiffType.DELETED === record.diffType) {
        this.#createRowElement(record.key, [ValueType.ARRAY === record.valueType ? "[" : "{", null], depth, prevRecord, false, list);
      } else if (DiffType.CREATED === record.diffType) {
        this.#createRowElement(record.key, [null, ValueType.ARRAY === record.valueType ? "[" : "{"], depth, prevRecord, false, list);
      } else {
        this.#createRowElement(record.key, ValueType.ARRAY === record.valueType ? "[" : "{", depth, prevRecord, false, list);
      }

      record.value.forEach((v, i) => {
        const prevRecord = i < 1 ? null : record.value[i - 1];
        const nextRecord = i + 1 < record.value.length ? record.value[i + 1] : null;
        this.#render(v, depth + 1, prevRecord, nextRecord, record.value);
      });

      if (DiffType.DELETED === record.diffType) {
        this.#createRowElement(null, [ValueType.ARRAY === record.valueType ? "]" : "}", null], depth, prevRecord, nextRecord, list);
      } else if (DiffType.CREATED === record.diffType) {
        this.#createRowElement(null, [null, ValueType.ARRAY === record.valueType ? "]" : "}"], depth, prevRecord, nextRecord, list);
      } else {
        this.#createRowElement(null, ValueType.ARRAY === record.valueType ? "]" : "}", depth, prevRecord, nextRecord, list);
      }
    }
  }

  #createRowElement = (key, value, depth, prevRecord, nextRecord, list) => {
    if (key && prevRecord && key === prevRecord.key) {
      if ("object" === typeof(value) && value.constructor === Array) {
        value = [prevRecord.value, value[1]];
      } else {
        value = [prevRecord.value, value];
      }
    }
    if (key && nextRecord && key === nextRecord.key) {
      return;
    }

    const asisTR = document.createElement("tr");
    const asisTH = document.createElement("th");
    const asisNumber = document.createElement("pre");
    const asisTD = document.createElement("td");
    const asisContents = document.createElement("pre");

    asisTR.appendChild(asisTH);
    asisTR.appendChild(asisTD);
    asisTH.appendChild(asisNumber);
    asisTD.appendChild(asisContents);

    const tobeTR = document.createElement("tr");
    const tobeTH = document.createElement("th");
    const tobeNumber = document.createElement("pre");
    const tobeTD = document.createElement("td");
    const tobeContents = document.createElement("pre");

    tobeTR.appendChild(tobeTH);
    tobeTR.appendChild(tobeTD);
    tobeTH.appendChild(tobeNumber);
    tobeTD.appendChild(tobeContents);

    let asisHasNext = false;
    let tobeHasNext = false;

    if (nextRecord && list) {
      let i = list.indexOf(nextRecord);
      if (i >= 0) {
        for (; i < list.length; i++) {
          if (DiffType.EXACTED === list[i].diffType) {
            asisHasNext = true;
            tobeHasNext = true;
            break;
          }
          if (DiffType.DELETED === list[i].diffType) {
            asisHasNext = true;
          }
          if (DiffType.CREATED === list[i].diffType) {
            tobeHasNext = true;
          }
        }
      }
    }

    if (value && "object" === typeof(value)) {
      if (value.constructor === Array) {
        if (value[0] !== null) {
          asisNumber.innerText = ++this.#asisLineNumber;
          asisContents.innerHTML = this.#formatContents(key, value[0], depth, asisHasNext);
        } else {
          asisNumber.innerText = " "
        }
        if (value[1] !== null) {
          tobeNumber.innerText = ++this.#tobeLineNumber;
          tobeContents.innerHTML = this.#formatContents(key, value[1], depth, tobeHasNext);
        } else {
          tobeNumber.innerText = " "
        }

        if (tobeContents.innerText === "") {
          asisNumber.style.backgroundColor = BACKGROUND_COLOR_RED;
          asisTD.style.backgroundColor = BACKGROUND_COLOR_RED;
          asisContents.style.backgroundColor = BACKGROUND_COLOR_RED;
        } else if (asisContents.innerText === "") {
          tobeNumber.style.backgroundColor = BACKGROUND_COLOR_GREEN;
          tobeTD.style.backgroundColor = BACKGROUND_COLOR_GREEN;
          tobeContents.style.backgroundColor = BACKGROUND_COLOR_GREEN;
        } else if (asisContents.innerText !== tobeContents.innerText) {
          asisNumber.style.backgroundColor = BACKGROUND_COLOR_YELLOW;
          asisTD.style.backgroundColor = BACKGROUND_COLOR_YELLOW;
          asisContents.style.backgroundColor = BACKGROUND_COLOR_YELLOW;
          tobeNumber.style.backgroundColor = BACKGROUND_COLOR_YELLOW;
          tobeTD.style.backgroundColor = BACKGROUND_COLOR_YELLOW;
          tobeContents.style.backgroundColor = BACKGROUND_COLOR_YELLOW;
        }
      }
    } else {
      asisNumber.innerText = ++this.#asisLineNumber;
      asisContents.innerText = this.#formatContents(key, value, depth, asisHasNext);
      tobeNumber.innerText = ++this.#tobeLineNumber;
      tobeContents.innerText = this.#formatContents(key, value, depth, tobeHasNext);
    }

    this.#asisTable.appendChild(asisTR);
    this.#tobeTable.appendChild(tobeTR);
  }

  #formatContents = (key, value, depth, hasNext) => {
    if ("string" === typeof(value)) {
      if (value === "[" || value === "]" || value === "{" || value === "}") {
        // NO-OP
      } else {
        return `${"  ".repeat(depth)}${(key ? `"${key}": ` : "")}"${value}"${hasNext ? "," : ""}`;
      }
    }
    return `${"  ".repeat(depth)}${(key ? `"${key}": ` : "")}${value}${hasNext ? "," : ""}`;
  };
}

export const comparison = new Comparison();
