/**
 * Deep equality comparison for Arrays
 * @param {Array} a The array to compare against
 * @param {Array} b The array to compare with
 * @returns {boolean} If the two arrays are equal
 */
export default function deepEqual(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) {
        return false;
      }
    }

    return true;
  } else {
    if (typeof a.isEqual === 'function' && typeof b.isEqual === 'function') {
      return a.isEqual(b);
    }
    return a === b;
  }
}
