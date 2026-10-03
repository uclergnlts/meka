// localStorage throws when a visitor blocks site data; the page must still render then.
export function readStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Nothing to do: the preference simply is not remembered.
  }
}
