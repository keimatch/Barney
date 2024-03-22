export const difference = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
  const differenceSet = new Set<T>();

  for (const item of setA) {
    if (!setB.has(item)) {
      differenceSet.add(item);
    }
  }

  return differenceSet;
};

export const intersection = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
  const intersectionSet = new Set<T>();

  for (const item of setA) {
    if (setB.has(item)) {
      intersectionSet.add(item);
    }
  }

  return intersectionSet;
};

export const union = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
  const unionSet = new Set<T>(setA);

  for (const item of setB) {
    unionSet.add(item);
  }

  return unionSet;
};

export const xor = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
  const unionSet = union(setA, setB);
  const intersectionSet = intersection(setA, setB);
  return difference(unionSet, intersectionSet);
};
