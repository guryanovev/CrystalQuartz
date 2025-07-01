export const NULL_IF_EMPTY = (value: string | null | undefined) => {
  if (value === null || value === undefined) {
    return null;
  }

  return value === '' ? null : value;
};
