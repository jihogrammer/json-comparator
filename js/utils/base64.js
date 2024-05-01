const base64ToBytes = (base64) => {
  const binString = atob(base64);
  return Uint8Array.from(binString, (m) => m.codePointAt(0));
}

const bytesToBase64 = (bytes) => {
  const binString = String.fromCodePoint(...bytes);
  return btoa(binString);
}

const isWellFormed = (input) => {
  if (typeof(input.isWellFormed) == "undefined") {
    try {
      encodeURIComponent(input);
      return true;
    } catch (error) {
      return false;
    }
  } else {
    return input.isWellFormed();
  }
}

export const encodeBase64 = (input) => {
  if (isWellFormed(input)) {
    return bytesToBase64(new TextEncoder().encode(input));
  }
  throw new Error(`Failed to encode: "${input}"`);
};

export const decodeBase64 = (input) => {
  if (isWellFormed(input)) {
    return new TextDecoder().decode(base64ToBytes(input));
  }
  throw new Error(`Failed to decode: "${input}"`);
};
