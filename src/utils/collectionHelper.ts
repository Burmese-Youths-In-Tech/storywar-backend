export function collectionHelper<T, B extends object>(
  data: B,
  collectionArray: string[] = []
): T {
  const obj = collectionArray.reduce((prev, key) => {
    const value = data[key as keyof typeof data]
      ? data[key as keyof typeof data]
      : typeof data[key as keyof typeof data] === "string"
      ? ""
      : typeof data[key as keyof typeof data] === "number"
      ? 0
      : typeof data[key as keyof typeof data] === "boolean"
      ? false
      : null;

    return { ...prev, [key as keyof typeof data]: value };
  }, {});

  return obj as T;
}
