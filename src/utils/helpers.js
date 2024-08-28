export function isObjEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export function isError(subject) {
  return subject instanceof Error
}

export function isEmptyValue(subject) {
  return subject == undefined || subject == '';
}
