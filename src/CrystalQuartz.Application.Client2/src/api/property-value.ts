import { Property } from './property';

export type ObjectPropertyValue = {
  typeCode: 'object';
  nestedProperties: Property[];
  overflowed?: true;
};
export type EnumerablePropertyValue = {
  typeCode: 'enumerable';
  nestedValues: (PropertyValue | null)[];
  overflowed?: true;
};
export type SinglePropertyValue = { typeCode: 'single'; kind: number; rawValue: string };
export type ErrorPropertyValue = { typeCode: 'error'; errorMessage: string };
export type EllipsisPropertyValue = { typeCode: '...' };
export type PropertyValue =
  | SinglePropertyValue
  | ErrorPropertyValue
  | EllipsisPropertyValue
  | ObjectPropertyValue
  | EnumerablePropertyValue;
