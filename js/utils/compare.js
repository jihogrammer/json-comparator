"use strict";

export const DiffType = Object.freeze({
  EXACTED: "EXACTED",
  DELETED: "DELETED",
  CREATED: "CREATED",
});

export const ValueType = Object.freeze({
  NULL: "NULL",
  SCALAR: "SCALAR",
  OBJECT: "OBJECT",
  ARRAY: "ARRAY",

  of: (instnace) => {
    if (instnace === null) return ValueType.NULL;

    const type = typeof(instnace);

    if (type === "number" || type === "string" || type === "boolean") {
      return ValueType.SCALAR;
    }
    if (type === "object") {
      return instnace.constructor === Array ? ValueType.ARRAY : ValueType.OBJECT;
    }

    throw new Error("Unexpected type: " + instnace);
  },
});

class DiffRecord {
  /**
   * @param {string} key
   * @param {string | number | boolean | DiffRecord[] | null} value
   * @param {ValueType} valueType
   * @param {DiffType} diffType
   */
  constructor(key, value, valueType, diffType) {
    this.key = key;
    this.value = value;
    this.valueType = valueType;
    this.diffType = diffType;
  }

  static compare = (a, b) => {
    if (a.key === b.key) {
      if (DiffType.CREATED === a.diffType) {
        return 1;
      } else if (DiffType.DELETED === a.diffType) {
        return -1;
      } else {
        0
      }
    }

    if (a.key > b.key) {
      return 1;
    }

    if (b.key > a.key) {
      return -1;
    }

    return 0;
  };
}

class Comparator {
  #compareDepth = (value, diffType) => {
    const valueType = ValueType.of(value);

    if (ValueType.OBJECT === valueType) {
      return this.#compareDepthObject(value, diffType);
    }
    if (ValueType.ARRAY === valueType) {
      return this.#compareDepthArray(value, diffType);
    }
    return value;
  };

  #compareDepthObject = (object, diffType) => {
    const result = [];

    for (const key in object) {
      const value = object[key];
      const valueType = ValueType.of(value);

      if (ValueType.OBJECT === valueType) {
        result.push(new DiffRecord(key, this.#compareDepthObject(value, diffType), ValueType.OBJECT, diffType));
      } else if (ValueType.ARRAY === valueType) {
        result.push(new DiffRecord(key, this.#compareDepthArray(value, diffType), ValueType.ARRAY, diffType));
      } else {
        result.push(new DiffRecord(key, value, ValueType.SCALAR, diffType));
      }
    }

    result.sort(DiffRecord.compare);
    return result;
  };

  #compareDepthArray = (array, diffType) => {
    const result = [];

    for(let i = 0; i < array.length; i++) {
      const value = array[i];
      const valueType = ValueType.of(value);

      if (ValueType.OBJECT === valueType) {
        result.push(new DiffRecord(key, this.#compareDepthObject(value, diffType), ValueType.OBJECT, diffType));
      } else if (ValueType.ARRAY === valueType) {
        result.push(new DiffRecord(key, this.#compareDepthArray(value, diffType), ValueType.ARRAY, diffType));
      } else {
        result.push(new DiffRecord(key, value, ValueType.SCALAR, diffType));
      }
    }

    return result;
  };

  #compareRoot = (result, asis, tobe, key) => {
    const asisType = ValueType.of(asis);
    const tobeType = ValueType.of(tobe);

    if (asisType === tobeType) {
      if (ValueType.OBJECT === asisType) {
        result.push(new DiffRecord(key, this.#compareObject(asis, tobe), ValueType.OBJECT, DiffType.EXACTED));
      } else if (ValueType.ARRAY === asisType) {
        result.push(new DiffRecord(key, this.#compareArray(asis, tobe), ValueType.ARRAY, DiffType.EXACTED));
      } else {
        if (asis === tobe) {
          result.push(new DiffRecord(key, asis, ValueType.SCALAR, DiffType.EXACTED));
        } else {
          result.push(new DiffRecord(key, asis, ValueType.SCALAR, DiffType.DELETED));
          result.push(new DiffRecord(key, tobe, ValueType.SCALAR, DiffType.CREATED));
        }
      }
    } else {
      result.push(new DiffRecord(key, this.#compareDepth(asis, DiffType.DELETED), asisType, DiffType.DELETED));
      result.push(new DiffRecord(key, this.#compareDepth(tobe, DiffType.CREATED), tobeType, DiffType.CREATED));
    }
  }

  #compareArray = (asis, tobe) => {
    const result = [];

    for (let i = 0; i < Math.max(asis.length, tobe.length); i++) {
      if (i < asis.length && i < tobe.length) {
        this.#compareRoot(result, asis[i], tobe[i], null);
      } else if (i < asis.length) {
        result.push(new DiffRecord(null, this.#compareDepth(asis[i], DiffType.DELETED), ValueType.of(asis[i]), DiffType.DELETED));
      } else {
        result.push(new DiffRecord(null, this.#compareDepth(tobe[i], DiffType.CREATED), ValueType.of(tobe[i]), DiffType.CREATED));
      }
    }

    return result;
  }

  #compareObject = (asis, tobe) => {
    const result = [];

    for (const key in asis) {
      if (tobe.hasOwnProperty(key)) {
        this.#compareRoot(result, asis[key], tobe[key], key);
      } else {
        result.push(new DiffRecord(key, this.#compareDepth(asis[key], DiffType.DELETED), ValueType.of(asis[key]), DiffType.DELETED));
      }
    }

    for (const key in tobe) {
      if (asis.hasOwnProperty(key)) {
        // NO-OP
      } else {
        result.push(new DiffRecord(key, this.#compareDepth(tobe[key], DiffType.CREATED), ValueType.of(tobe[key]), DiffType.CREATED));
      }
    }

    result.sort(DiffRecord.compare);
    return result;
  }

  compare = (asis, tobe) => {
    const asisType = ValueType.of(asis);
    const tobeType = ValueType.of(tobe);

    if (ValueType.OBJECT === asisType && ValueType.OBJECT === tobeType) {
      return new DiffRecord(null, this.#compareObject(asis, tobe), ValueType.OBJECT, null);
    } else if (ValueType.ARRAY === asisType && ValueType.ARRAY === tobeType) {
      return new DiffRecord(null, this.#compareArray(asis, tobe), ValueType.ARRAY, null);
    } else {
      throw new Error(`Unexpected comparison: '${JSON.stringify(asis)}' and '${JSON.stringify(tobe)}'`);
    }
  };
}

export const comparator = new Comparator();
