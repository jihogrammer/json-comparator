"use strict";

import { ValueType, DiffType } from "../utils/compare.js";

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

    this.#render(report, 0, null, null);

    return this.#element;
  };

  #render = (record, depth, prevRecord, nextRecord) => {
    if (ValueType.SCALAR === record.valueType) {
      if (DiffType.EXACTED === record.diffType) {
        this.#createRowElement(record.key, record.value, depth, prevRecord, nextRecord);
      } else if (DiffType.DELETED === record.diffType) {
        this.#createRowElement(record.key, [record.value, null], depth, prevRecord, nextRecord);
      } else {
        this.#createRowElement(record.key, [null, record.value], depth, prevRecord, nextRecord);
      }
    } else {
      if (DiffType.DELETED === record.diffType) {
        this.#createRowElement(record.key, [`${ValueType.ARRAY === record.valueType ? "[" : "{"}`, null], depth, prevRecord, false);
      } else if (DiffType.CREATED === record.diffType) {
        this.#createRowElement(record.key, [null, `${ValueType.ARRAY === record.valueType ? "[" : "{"}`], depth, prevRecord, false);
      } else {
        this.#createRowElement(record.key, `${ValueType.ARRAY === record.valueType ? "[" : "{"}`, depth, prevRecord, false);
      }

      record.value.forEach((v, i) => {
        const prevRecord = i === 0 ? null : record.value[i - 1];
        const nextRecord = i + 1 < record.value.length ? record.value[i + 1] : null;
        this.#render(v, depth + 1, prevRecord, nextRecord);
      });

      if (DiffType.DELETED === record.diffType) {
        this.#createRowElement(null, [`${ValueType.ARRAY === record.valueType ? "]" : "}"}`, null], depth, prevRecord, nextRecord);
      } else if (DiffType.CREATED === record.diffType) {
        this.#createRowElement(null, [null, `${ValueType.ARRAY === record.valueType ? "]" : "}"}`], depth, prevRecord, nextRecord);
      } else {
        this.#createRowElement(null, `${ValueType.ARRAY === record.valueType ? "]" : "}"}`, depth, prevRecord, nextRecord);
      }
    }
  }

  #createRowElement = (key, value, depth, prevRecord, nextRecord) => {
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

    if ("object" === typeof(value)) {
      if (value.constructor === Array) {
        if (value[0]) {
          asisNumber.innerText = ++this.#asisLineNumber;
          asisContents.innerHTML = this.#formatContents(key, value[0], depth, nextRecord);
        } else {
          asisNumber.innerText = " "
        }
        if (value[1]) {
          tobeNumber.innerText = ++this.#tobeLineNumber;
          tobeContents.innerHTML = this.#formatContents(key, value[1], depth, nextRecord);
        } else {
          tobeNumber.innerText = " "
        }

        if (tobeContents.innerText === "") {
          asisNumber.style.backgroundColor = "rgba(255, 0, 0, 33%)";
          asisTD.style.backgroundColor = "rgba(255, 0, 0, 33%)";
          asisContents.style.backgroundColor = "rgba(255, 0, 0, 33%)";
        } else if (asisContents.innerText === "") {
          tobeNumber.style.backgroundColor = "rgba(0, 255, 0, 33%)";
          tobeTD.style.backgroundColor = "rgba(0, 255, 0, 33%)";
          tobeContents.style.backgroundColor = "rgba(0, 255, 0, 33%)";
        } else if (asisContents.innerText !== tobeContents.innerText) {
          asisNumber.style.backgroundColor = "rgba(255, 255, 0, 33%)";
          asisTD.style.backgroundColor = "rgba(255, 255, 0, 33%)";
          asisContents.style.backgroundColor = "rgba(255, 255, 0, 33%)";
          tobeNumber.style.backgroundColor = "rgba(255, 255, 0, 33%)";
          tobeTD.style.backgroundColor = "rgba(255, 255, 0, 33%)";
          tobeContents.style.backgroundColor = "rgba(255, 255, 0, 33%)";
        }
      }
    } else {
      asisNumber.innerText = ++this.#asisLineNumber;
      asisContents.innerText = this.#formatContents(key, value, depth, nextRecord);
      tobeNumber.innerText = ++this.#tobeLineNumber;
      tobeContents.innerText = this.#formatContents(key, value, depth, nextRecord);
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
