import deepEqual from '../deepEqual';

test('returns false when different data types are provided', () => {
  expect(deepEqual('foo', ['bar'])).toBe(false);
});

test('returns false if arrays have a different length', () => {
  expect(deepEqual(['a', 'b', 'c'], ['a'])).toBe(false);
});

test('returns true if arrays are the same', () => {
  expect(deepEqual(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(true);
});

test('returns false if arrays are different', () => {
  expect(deepEqual(['a', 'b', 'c'], ['d', 'e', 'f'])).toBe(false);
});

test('returns true if nested arrays are the same', () => {
  expect(deepEqual(['a', ['b', ['c']]], ['a', ['b', ['c']]])).toBe(true);
});

test('returns false if nested arrays are different', () => {
  expect(deepEqual(['a', ['b', ['c']]], ['d', ['e', ['f']]])).toBe(false);
});
