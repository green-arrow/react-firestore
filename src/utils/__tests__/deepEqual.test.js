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

function mockIsEqual(other) {
  return this.value === other.value;
}
test('returns true when isEqual method is available and isEqual returns true', () => {
  const mockA = {
    value: 'document/id',
    isEqual: mockIsEqual,
  };
  const mockB = {
    value: 'document/id',
    isEqual: mockIsEqual,
  };
  expect(mockA === mockB).toBe(false);
  expect(deepEqual([mockA], [mockB])).toBe(true);
});

test('returns false when isEqual method is available and isEqual returns false', () => {
  const mockA = {
    value: 'document/id',
    isEqual: mockIsEqual,
  };
  const mockC = {
    value: 'something-different',
    isEqual: mockIsEqual,
  };
  expect(mockA === mockC).toBe(false);
  expect(deepEqual([mockA], [mockC])).toBe(false);
});
